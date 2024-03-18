import React, { useEffect, useState } from "react";
import AppLayout from "../../Layout/AppLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaPhoneAlt } from "react-icons/fa";
import AddFoodItem from "../../Components/Restaurant/AddFoodItem";
import {
  deleteMenuItem,
  fetchMenuItems,
} from "../../Redux/Slices/restaurantSlice";
import MenuItemCard from "../../Components/Cards/MenuItemCard";
import { MdMail, MdOutlineStar } from "react-icons/md";
import NoItemImage from "../../Assets/NoMenuItemFound.png";

const RestaurantDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const { resdata } = location.state;

  const { role, data } = useSelector((state) => state?.auth);
  const { menuItems } = useSelector((state) => state?.restaurant);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isVeg, setIsVeg] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  const [editMode, setEditMode] = useState(false);
  const [dataToEdit, setDataToEdit] = useState(null);

  useEffect(() => {
    console.log(resdata);
    if (!resdata) {
      navigate("/");
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    setSearchResults(menuItems);
  }, [menuItems]);

  useEffect(() => {
    handleSearchSortFilter();
  }, [searchText, sortBy, isVeg]);

  async function fetchData() {
    try {
      if (!resdata) {
        navigate("/");
      } else {
        await dispatch(fetchMenuItems(resdata?._id));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  function handleSearchSortFilter() {
    let filteredMenuItems = menuItems.filter((item) => {
      const matchesSearchText = item.name
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const isVegMatch = isVeg ? item.type === "Veg" : true;
      return matchesSearchText && isVegMatch;
    });

    if (sortBy === "priceHighToLow") {
      filteredMenuItems.sort((a, b) => b.price - a.price);
    } else if (sortBy === "priceLowToHigh") {
      filteredMenuItems.sort((a, b) => a.price - b.price);
    }

    setSearchResults(filteredMenuItems);
  }

  function handleDeleteMenuItem(menuItemId) {
    confirm = window.confirm("MenuItem Remove");
    if (confirm) {
      dispatch(deleteMenuItem(menuItemId));
    }
  }

  function handleEditMenuItem(ItemToEdit) {
    setEditMode(true);
    setDataToEdit(ItemToEdit);
  }

  return (
    <AppLayout>
      <div className="w-2/3 border border-x-gray-300 mx-auto h-auto font-custom lg:w-4/5 md:w-11/12 sm:w-full">
        <div className="flex gap-16 w-full items-center justify-between py-4 px-10 mt-10">
          <div className="flex gap-6">
            <div>
              <img
                src={resdata?.photo?.photoUrl}
                className="w-60 h-36 rounded-md"
              />
            </div>
            <div className="flex flex-col items-start justify-between gap-2">
              <div className="text-2xl font-extrabold">
                {resdata?.restaurantName}
              </div>
              <div className="text-sm">{resdata?.quickDescription}</div>
              <div className="text-xs">{resdata?.address}</div>
              <div className="text-xs">
                {resdata?.cuisines[0].split(",")?.map((cuisine) => {
                  return (
                    <span
                      key={cuisine}
                      className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold text-gray-900"
                    >
                      {cuisine}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8 items-center">
            <div>
              {role === "Restaurant" && data?._id === resdata?.user_id && (
                <button
                  onClick={() =>
                    navigate("/create/Restaurant", {
                      state: { dataToEdit: resdata },
                    })
                  }
                  className="btn btn-active btn-link"
                >
                  Edit Restaurant Details
                </button>
              )}
            </div>
            <div className="border border-gray-400 font-medium rounded-lg p-1 shadow-md">
              <p>
                OPEN <span>{resdata?.openingHours}</span> TO
                <span>{resdata?.closingHours}</span>
              </p>
            </div>
            <div className="flex flex-col p-2 border border-gray-400 w-auto gap-2 rounded-xl shadow-md">
              <div className="text-green-400 flex items-center justify-center gap-1">
                4.4 <MdOutlineStar />
              </div>
              <hr />
              <div className="text-gray-500">1M+ Rating</div>
            </div>
          </div>
        </div>
        {/* <hr /> */}
        <div className="flex gap-32 w-full items-center justify-between py-3 px-12">
          <div className="flex flex-col justify-between gap-3">
            <p className="text-xl font-bold">About US</p>
            <p className="text-sm text-gray-700">
              {resdata?.detailedDescription}
            </p>
          </div>
          <div className="flex flex-col items-start justify-between gap-2">
            <p className="text-xl font-bold">Contact Info</p>
            <p className="flex items-center justify-center gap-2">
              <MdMail />
              <p className="text-gray-700"> sc494802@gmail.com</p>
            </p>
            <p className="flex items-center justify-center gap-2 ">
              <FaPhoneAlt />{" "}
              <p className="text-gray-700"> {resdata?.phoneNumber}</p>
            </p>
          </div>
        </div>
        <hr className="mt-5 border-solid border-2 mx-10 border-grey-500" />
        {role === "Restaurant" && data?._id === resdata?.user_id && (
          <AddFoodItem
            resId={resdata._id}
            editMode={editMode}
            dataToEdit={dataToEdit}
            setEditMode={setEditMode}
            setDataToEdit={setDataToEdit}
          />
        )}
        <div className="flex gap-40 w-full items-center justify-center mt-5 py-5">
          {/* Search and Sort */}
          <div className="flex space-x-4 items-center">
            {/* Search Input */}
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="search by menu item name..."
              className="input input-bordered input-md w-96 max-w-3xl "
            />

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="default">Sort By</option>
                <option value="priceHighToLow">Price High To Low</option>
                <option value="priceLowToHigh">Price Low To High</option>
              </select>
            </div>
          </div>

          {/* Veg Only Toggle */}
          <div>
            <label className="flex items-center relative w-max cursor-pointer select-none">
              <span className="text-lg font-bold mr-3">Veg Only</span>
              <input
                type="checkbox"
                className={`appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none  ${
                  isVeg ? "bg-green-500 " : "bg-red-500"
                }`}
                checked={false}
                onChange={() => setIsVeg((prevIsVeg) => !prevIsVeg)}
              />
              <span
                className={`absolute font-medium text-xs uppercase right-1 text-white ${
                  isVeg ? "hidden" : ""
                }`}
              >
                {" "}
                OFF{" "}
              </span>
              <span
                className={`absolute font-medium text-xs uppercase right-8 text-white  ${
                  isVeg ? "" : "hidden"
                }`}
              >
                {" "}
                ON{" "}
              </span>
              <span
                className={`w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200 ${
                  isVeg ? "translate-x-7" : ""
                }`}
              />
            </label>
          </div>
        </div>

        {role != "Restaurant" ? (
          <div className="flex flex-col justify-center items-center">
            {searchResults.length == 0 ? (
              <div className="flex items-center justify-center">
                <img
                  src={NoItemImage}
                  alt="No Items Found"
                  className="h-[400px] w-[500px]"
                />
              </div>
            ) : (
              searchResults?.map((item) => {
                return <MenuItemCard key={item?._id} menuItem={item} />;
              })
            )}
          </div>
        ) : (
          <div className="px-36">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Veg / Non-Veg</th>
                  <th>Oprations</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length == 0 ? (
                  <tr>No Item Found</tr>
                ) : (
                  <>
                    {searchResults.map((item) => {
                      return (
                        <tr key={item._id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="mask mask-squircle w-12 h-12">
                                  <img
                                    src={item?.foodImg?.url}
                                    alt="Food Image"
                                    className="rounded-md h-28 w-36"
                                  />
                                </div>
                              </div>
                              <div>
                                <div className="font-bold">{item.name}</div>
                                <div className="text-sm opacity-50">
                                  {item._id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {item.price}
                            <span className="badge badge-ghost badge-sm">
                              RS
                            </span>
                          </td>
                          <td className="flex gap-2">
                            <span>{item.type}</span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleEditMenuItem({ ...item })}
                              className="btn btn-info btn-sm mx-3"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteMenuItem(item._id)}
                              className="btn bg-red-300 btn-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default RestaurantDetails;
