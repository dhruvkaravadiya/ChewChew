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
                variant={`${isActiveTab ? "destructive" : "white"}`}
                className={`flex border-none items-center text-md justify-start text-white gap-4 rounded-lg font-medium 
                    ${isActiveTab ? "text-white" : "text-gray-800"}
                `}
            >
                {clonedIcon} {itemname}
            </Button>
        </>
    );
}
