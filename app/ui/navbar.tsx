import {Button} from "@/components/ui/button";
import Link from "next/link";
import DropDownMenuWithIcon from "@/ui/dropDownMenuWithIcon";
import NameWithDropdown from "@/ui/nameWithDropdown";
import {Suspense} from "react";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";

export default function Navbar() {
    return (
        <section className="fixed top-0 w-full z-50 h-16 py-4 bg-teal-300">
            <div className="px-4 sm:px-10 lg:px-20">
                <nav className="flex justify-between">
                    <div className="flex gap-6">
                        <Link href="/home" className="flex items-center gap-2">
                            <img src="logo.svg" alt="logo" className="max h-6"/>
                            <span className="text-lg font-semibold tracking-tighter">
                                Links
                            </span>
                        </Link>
                        <div className="flex items-center"></div>
                    </div>
                    <div className="flex gap-2">
                        <Suspense fallback={<Avatar>
                            <AvatarFallback>Li</AvatarFallback>
                            </Avatar>}>
                            <NameWithDropdown />
                        </Suspense>
                    </div>
                </nav>
            </div>
        </section>
    )
}