import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    // <footer className="bg-gray-900 text-gray-400 py-4 mt-8 text-sm flex justify-between sticky font-custom">
    //   <div className="container mx-auto flex flex-col items-center">
    //     <p className="mb-2">&copy; {new Date().getFullYear()} Chirag Solanki</p>
    //     <p className="mb-2">
    //       Reach me at{" "}
    //       <a href="mailto:sc494802@gmail.com" className="underline">
    //         <HiOutlineMail className="inline-block text-xl mr-2" />
    //         sc494802@gmail.com
    //       </a>
    //     </p>
    //     <div className="flex mb-2">
    //       <p className="mr-2">Connect with me:</p>
    //       <a
    //         href="https://github.com/chiragaug6/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-blue-400 hover:text-blue-600 mr-2"
    //       >
    //         <AiFillGithub className="inline-block text-2xl" />
    //       </a>
    //       <a
    //         href="https://www.linkedin.com/in/chiragaug6/"
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-blue-400 hover:text-blue-600"
    //       >
    //         <AiFillLinkedin className="inline-block text-2xl" />
    //       </a>
    //     </div>
    //   </div>
    // </footer>
    <footer className="footer p-10 mt-20 px-32 bg-base-300 text-base-content">
      <nav>
        <h6 className="footer-title">Services</h6>
        <a className="link link-hover">Branding</a>
        <a className="link link-hover">Design</a>
        <a className="link link-hover">Marketing</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
      <form>
        <h6 className="footer-title">Newsletter</h6>
        <fieldset className="form-control w-80">
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label>
          <div className="join">
            <input
              type="text"
              placeholder="username@site.com"
              className="input input-bordered join-item"
            />
            <button className="btn btn-primary join-item">Subscribe</button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
};

export default Footer;
