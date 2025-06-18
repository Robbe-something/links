import { login, signup } from '@/utils/supabase/auth_actions'
import { type Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    description: "Login",
};

export default function LoginPage() {
    return (
        <form>
            <label htmlFor="email">Email:</label>
            <input id="email" name="email" type="email" required />
            <label htmlFor="password">Password:</label>
            <input id="password" name="password" type="password" required />
            <button formAction={login}>Log in</button>
        </form>
    )
}