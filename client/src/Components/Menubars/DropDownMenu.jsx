/* eslint-disable react/prop-types */
"use client";

import * as React from "react";
import { Link } from "react-router-dom";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
export function DropDownMenu({ data, role, handleLogout, RestaurantExist }) {
    console.log(data.photo.photoUrl);
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div className="cursor-pointer flex flex-row[] gap-0 md:gap-3 lg:gap-3 items-center justify-center">
                    <Avatar>
                        <AvatarImage src={data?.photo?.photoUrl} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <DropdownMenuLabel>
                        {" "}
                        <span className="text-medium text-md hidden md:flex lg:flex">
                            {data?.name}
                        </span>
                    </DropdownMenuLabel>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto mr-2">
                <DropdownMenuItem asChild>
                    <Link
                        to="/profile"
                        className="justify-between cursor-pointer hover:bg-custom-light-gray px-4 py-2 w-full text-left"
                    >
                        Profile
                    </Link>
                </DropdownMenuItem>
                {role === "Restaurant" && !RestaurantExist(data?._id) && (
                    <DropdownMenuItem asChild>
                        <Link
                            to="/create/Restaurant"
                            className="justify-between cursor-pointer hover:bg-custom-light-gray px-4 py-2 w-full text-left"
                        >
                            Add Restaurant
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link
                        to="/myorder"
                        className="justify-between cursor-pointer hover:bg-custom-light-gray px-4 py-2 w-full text-left"
                    >
                        My Order
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        onClick={handleLogout}
                        className="justify-between cursor-pointer hover:bg-custom-light-gray px-4 py-2 w-full text-left"
                    >
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
