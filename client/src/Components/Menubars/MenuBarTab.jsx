import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import React from "react";

// eslint-disable-next-line react/prop-types
export default function MenuBarTab({ itemname, link, icon }) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActiveTab = location.pathname === link;

    const clonedIcon = React.cloneElement(icon, {
        className: "h-5 w-5",
    });

    return (
        <>
            <Button
                onClick={() => {
                    navigate(`${link}`);
                }}
                className={`flex items-center text-md justify-start gap-4 rounded-lg font-medium ${
                    isActiveTab
                        ? "bg-custom-red-2 text-white"
                        : "bg-white text-black"
                }`}
            >
                {clonedIcon} {itemname}
            </Button>
        </>
    );
}
