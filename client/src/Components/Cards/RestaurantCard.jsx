import { MdOutlineStar } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const RestaurantCard = ({ resdata }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/restaurant/details", { state: { resdata } })}
      className="w-full max-w-sm bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105 cursor-pointer"
    >
      <img className="w-full h-48 object-cover" src={resdata?.photo?.photoUrl} alt="Restaurant" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{resdata?.restaurantName}</h3>
          <div className="flex items-center bg-green-500 text-white px-2 py-1 rounded-md">
            <p className="text-sm font-bold mr-1">{resdata?.avgRating}</p>
            <MdOutlineStar />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {resdata?.cuisines?.map((cuisine) => (
            <span key={cuisine} className="text-xs bg-gray-200 px-2 py-1 rounded-md">
              {cuisine}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
