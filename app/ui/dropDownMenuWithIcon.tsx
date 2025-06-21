"use client"

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import {LogOut, Settings} from "lucide-react";
import { logout } from "@/utils/supabase/auth_actions";
import {redirect} from "next/navigation";

export default function DropDownMenuWithIcon({
    userType, firstName, lastName
                                                   }: {
    userType: string,
    firstName: string,
    lastName: string
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-[2px] focus:ring-offset-2 focus:ring-primary rounded-full cursor-pointer">
                <Avatar>
                    <AvatarFallback>{firstName[0].toUpperCase() + lastName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel className="font-bold">{userType.charAt(0).toUpperCase() + userType.substring(1).toLowerCase()}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => redirect("/settings")} className="cursor-pointer">
                    <Settings className="h-4 w-4" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={async () => {
                    await logout()
                }}>
                    <LogOut className="h-4 w-4 text-destructive" /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
