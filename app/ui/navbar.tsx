import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Navbar() {
    return (
        <section className="fixed top-0 w-full z-50 h-16 py-4 bg-teal-300">
            <div className="px-4 sm:px-10 lg:px-20">
                <nav className="flex justify-between">
                    <div className="flex gap-6">
                        <a href={"https://links.robbe.tech"} className="flex items-center gap-2">
                            <img src="logo.svg" alt="logo" className="max h-6"/>
                            <span className="text-lg font-semibold tracking-tighter">
                                Links
                            </span>
                        </a>
                        <div className="flex items-center"></div>
                    </div>
                    <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm">
                            <Link href="/signout">
                                Logout
                            </Link>
                        </Button>
                    </div>
                </nav>
            </div>
        </section>
    )
}