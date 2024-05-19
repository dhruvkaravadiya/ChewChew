import { Link } from "react-router-dom";

const CartButton = ({ cartItems }) => {
    return (
        <Link
            to="/cart"
            className="relative flex items-center justify-center p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="black"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
            </svg>

            <span className="badge badge-sm absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white rounded-full h-5 w-5  text-xs font-semibold bg-custom-red-2 flex items-center justify-center">
                {cartItems.length ? cartItems.length : 0}
            </span>
        </Link>
    );
};

export default CartButton;
