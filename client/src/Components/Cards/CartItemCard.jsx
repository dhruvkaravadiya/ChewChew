import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { updateQuantity, removeItem } from "../../Redux/Slices/cartSlice.js";

const CartItemCard = ({ cItem }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-6 p-4 border-b border-gray-200">
      <img
        src={cItem?.foodImg?.url}
        alt="Food Image"
        className="rounded-md w-20 h-20 object-cover"
      />
      <div className="flex flex-col items-start justify-center gap-2">
        {/* <div className={`w-5 h-5 flex items-center justify-center border-2 ${cItem?.type === "Veg" ? "border-green-600" : "border-red-600"}`}>
          <span className={`w-3 h-3 ${cItem?.type === "Veg" ? "bg-green-600" : "bg-red-600"} rounded-full`}></span>
        </div> */}
        <h1 className="text-base text-gray-800 font-semibold">{cItem?.name}</h1>
        <h2 className="text-xs text-gray-600 flex items-center">
          <FaIndianRupeeSign className="text-xs" /> {cItem?.price}&nbsp; each
        </h2>
      </div>

      <div className="flex flex-col items-center justify-between gap-1 lg:gap-2 ml-auto">
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="rounded-full text-gray-600"
            onClick={() =>
              dispatch(
                updateQuantity({
                  itemId: cItem._id,
                  newQuantity: cItem.quantity - 1,
                })
              )
            }
          >
            <FaMinus className="h-3 w-3" />
          </button>
          <p className="h-9 w-9 rounded-md flex items-center justify-center">
            {cItem.quantity}
          </p>
          <button
            type="button"
            className="rounded-full  text-gray-600"
            onClick={() =>
              dispatch(
                updateQuantity({
                  itemId: cItem._id,
                  newQuantity: cItem.quantity + 1,
                })
              )
            }
          >
            <FaPlus className="h-3 w-3" />
          </button>
        </div>

        <button
          onClick={() => dispatch(removeItem(cItem?._id))}
          type="button"
          className="flex items-center space-x-1 text-red-500 hover:text-red-800"
        >
          <FaTrash size={16} />
          <span className="text-xs font-medium">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
