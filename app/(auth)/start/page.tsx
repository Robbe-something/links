import Link from "next/link";

export default function StartPage() {
    return (<>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
        </>)
}