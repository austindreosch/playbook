import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDisplayEmail, getInitials } from '@/utilities/stringUtils';
import { CreditCard, LogOut, Settings, User, UserPlus } from "lucide-react";
import Link from "next/link";
import React from "react";

const UserProfileDropdown = ({ user }) => {
    const adminSub = process.env.NEXT_PUBLIC_AUTH0_ADMIN_ID;
    const isAdmin = user && user.sub === adminSub;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 outline-none">
                <Avatar className="h-8 w-8 select-none shadow border-white"> {/* Added select-none here */}
                    <AvatarImage src={user.picture} alt="User" />
                    <AvatarFallback className="font-bold text-white bg-pb_blue">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{getDisplayEmail(user)}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <CreditCard className="h-4 w-4" />
                    <span>Imports</span>
                </DropdownMenuItem>

                {isAdmin && (
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                        <Link href="/admin" className="flex items-center gap-2 w-full">
                            <UserPlus className="h-4 w-4" />
                            <span>Admin Panel</span>
                            <span className="ml-auto text-xs text-gray-500">Ctrl + A</span>
                        </Link>
                    </DropdownMenuItem>
                )}

                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                    <span className="ml-auto text-xs text-gray-500">Ctrl + S</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    <Link href="/api/auth/logout" className="flex items-center gap-2 w-full">
                        <LogOut className="h-4 w-4" />
                        <span>Log out</span>
                        <span className="ml-auto text-xs text-gray-500">Ctrl + Shift + Q</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserProfileDropdown;