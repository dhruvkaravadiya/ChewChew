const User = require("../models/User");
const jwt = require("jsonwebtoken");
const cookieToken = require("../helpers/utils/cookieToken");
const {
    COOKIE_MAX_AGE,
    JWT_SECRET_KEY,
    JWT_EXPIRY,
    TOKEN_EXPIRY,
    CLOUDINARY_NAME,
    CLOUDINARY_API,
    CLOUDINARY_API_SECRET,
    LOCALHOST_ORIGIN,
} = require("../config/appConfig");
const { sendEmailToGmail } = require("../helpers/mailer/mailer");
const crypto = require("crypto");
const cloudinary = require("cloudinary");
const fs = require("fs");
const path = require("path");
const { io } = require("../startup/io");
cloudinary.v2.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API,
    api_secret: CLOUDINARY_API_SECRET,
});

async function userSignUp(req, res) {
    const { name, email, password } = req.body;

    // Check if data is there, if not throw error message
    if (!name || !email || !password) {
        return res.status(200).json({
            success: false,
            error: "All Fields Are Required",
        });
    }

    let hashedPassword; // Declare the password variable here

    // Check if user exists with provided email
    const userExists = await User.findOne({ email });

    // If user with email doesn't exist, throw the error
    if (userExists) {
        return res.status(404).json({
            success: false,
            error: "User already exist, Try different email",
        });
    }

    try {
        // Step 1: Check if a file (photo) was uploaded
        if (req.files && req.files.photo) {
            const file = req.files.photo;

            // Step 2: Upload the photo to Cloudinary
            const result = await cloudinary.v2.uploader.upload(
                file.tempFilePath,
                {
                    folder: "FOA_users",
                    width: 150,
                    public_id: file.name,
                }
            );
            // Step 3: Extract Cloudinary photo ID and URL
            const photoId = result.public_id;
            const photoUrl = result.secure_url;
            // Step 4: Create or update the user's data with the Cloudinary photo details
            hashedPassword = User.createHashedPassword(password); // Move this line here
            const user = new User({
                name,
                email,
                password: hashedPassword,
                // Add Cloudinary photo details to the user model
                photo: {
                    id: photoId,
                    photoUrl: photoUrl,
                },
            });

            if (req.body.role) {
                user.role = req.body.role;
            }
            // Save user data to MongoDB
            await user.save();

            // Step 5: Continue with the rest of the registration process
            const htmlFilePath = path.join(
                __dirname,
                "../helpers/mailer/welcome_mail.html"
            );
            const signUpTemplate = fs.readFileSync(htmlFilePath, "utf-8");
            await sendEmailToGmail({
                email: user.email,
                subject: "Welcome to our food ordering app!!!",
                html: signUpTemplate,
            });
            // Set cookie and respond
            await cookieToken(user, res, "User Created Successfully");
        } else {
            // Handle the case where no photo was uploaded
            return res
                .status(400)
                .json({ success: false, error: "Photo is required" });
        }
    } catch (error) {
        console.error("Error during User SignUp:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function userLogin(req, res) {
    const user = await User.findOne({ email: req.body.email }).select(
        "+password"
    );
    // console.log(req.body.email);
    // console.log(user);
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: "User Not Found" });
    }
    const isPasswordCorrect = await user.verifyPassword(req.body.password);
    if (!isPasswordCorrect) {
        return res
            .status(400)
            .json({ success: false, error: "Password is incorrect" });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRY,
    });
    const { password, ...otherProperties } = user._doc;
    console.log("Login successful");

    // Emit event when user logs in
    io.emit("userLoggedIn", "User Logged In");

    res.cookie("access_token", token, {
        maxAge: COOKIE_MAX_AGE,
        httpOnly: true,
        sameSite: "none",
        secure: true,
    });

    res.status(200).json({
        success: true,
        message: "Login Successful",
        data: otherProperties,
    });
}

async function userLogout(req, res) {
    res.cookie("access_token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({ success: true, message: "Successful Logout" });
}

async function forgotPassword(req, res) {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: "Email was not registered" });
    }

    const forgotPasswordToken = await user.getForgotPasswordToken();
    //temporarily turning off the { required : true } as we want to
    //just save the forgotPasswordToken and forgotPasswordExpiry
    //from the method getForgotPasswordToken
    await user.save({ validateBeforeSave: false });

    const url = `${LOCALHOST_ORIGIN}/password/reset/${forgotPasswordToken}`;
    const message = `Follow this link \n\n ${url}`;

    try {
        await sendEmailToGmail({
            email: user.email,
            subject: "Forgot Password",
            content: message,
        });
        res.status(200).json({
            success: true,
            message: "Email Sent Successfully",
        });
        //handle the case when there is error in sending the email ,as we also need
        // to make the two forgotPasswordToken and forgotPasswordExpiry to be undefined
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function resetPassword(req, res) {
    const token = req.params.token;
    const encryptedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        forgotPasswordToken: encryptedToken,
        forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
        return res
            .status(400)
            .json({ success: false, error: "Token invalid or expired" });
    }

    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({
            success: false,
            error: "Password and Confirm Password do not match",
        });
    }

    // Update the user's password
    user.password = User.createHashedPassword(req.body.password);
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    res.cookie("access_token", token, {
        httpOnly: true,
        expiresIn: new Date(Date.now() + TOKEN_EXPIRY),
    })
        .status(202)
        .json({ success: true, message: "Password Reset Successfull" });
}

async function getLoggedInUserDetails(req, res) {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}

async function updateLoggedInUserPassword(req, res) {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id).select("+password");
        const isPasswordCorrect = await user.verifyPassword(oldPassword);

        if (!isPasswordCorrect) {
            return res
                .status(400)
                .json({ success: false, error: "Password is incorrect" });
        }

        user.password = await User.createHashedPassword(newPassword);
        await user.save();

        await cookieToken(user, res, "Password Update Successfully");
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
}

async function updateUser(req, res) {
    try {
        // Check if req.user exists and has an id property
        if (!req.user || !req.user.id) {
            return res
                .status(401)
                .json({ success: false, error: "Unauthorized" });
        }

        const userId = req.user.id;
        const newData = {
            name: req.body.name,
            email: req.body.email,
        };

        if (req.files && req.files.photo) {
            const user = await User.findById(userId);

            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, error: "User not found" });
            }

            // Destroy the previous Cloudinary image
            const imageId = user.photo.id;
            if (imageId) {
                await cloudinary.v2.uploader.destroy(imageId);
            }

            // Upload the new photo to Cloudinary
            const result = await cloudinary.v2.uploader.upload(
                req.files.photo.tempFilePath,
                {
                    folder: "FOA_users",
                    width: 150,
                    crop: "scale",
                }
            );

            newData.photo = {
                id: result.public_id,
                photoUrl: result.secure_url,
            };
        }

        // Update the user in the database
        const updatedUser = await User.findByIdAndUpdate(userId, newData, {
            new: true,
            runValidators: true,
        });

        if (!updatedUser) {
            return res
                .status(404)
                .json({ success: false, error: "User not found" });
        }

        res.status(202).json({
            success: true,
            message: "User Details Updated",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Error during User Update:", error);
        return res
            .status(500)
            .json({ success: false, error: "Internal Server Error" });
    }
}

async function changeRole(req, res) {
    const roles = ["Customer", "Restaurant", "DeliveryMan"];
    const { newRole } = req.body;
    if (!roles.includes(newRole)) {
        return res.status(400).json({ success: false, error: "Invalid role" });
    }
    console.log(req.user);
    const userId = req.user.id;
    const user = await User.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true, runValidators: true }
    );
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: "User not found" });
    }
    res.status(202).json({
        success: true,
        message: "Role updated successfully",
        data: user,
    });
}

module.exports = {
    userSignUp,
    userLogin,
    userLogout,
    forgotPassword,
    resetPassword,
    getLoggedInUserDetails,
    updateLoggedInUserPassword,
    updateUser,
    changeRole,
};
