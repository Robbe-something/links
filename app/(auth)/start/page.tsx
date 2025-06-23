import Link from "next/link";
import { Button } from "@/components/ui/button";
import {Card} from "@/components/ui/card";

export default function StartPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <Card className="p-8 flex flex-col items-center gap-4 w-80">
                <Link href="/login" className="w-full">
                    <Button variant="default" className="w-full">Login</Button>
                </Link>
                <Link href="/register" className="w-full">
                    <Button variant="outline" className="w-full">Register</Button>
                </Link>
            </Card>
        </div>
    );
}