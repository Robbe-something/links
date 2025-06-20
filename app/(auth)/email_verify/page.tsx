'use client'

import {redirect, useSearchParams} from "next/navigation";
import { loginWithCode } from "@/utils/supabase/auth_actions";
import {useEffect, useState, Suspense} from "react";

// Component that uses useSearchParams
function VerifyEmail() {
    const code = useSearchParams().get('code')
    if (!code) {
        return <p>Please check your inbox to verify your email.</p>
    }

    let [verified, setVerified] = useState(false)

    useEffect(() => {
        loginWithCode(code).then(_ => {
            setVerified(true)
            setTimeout(() => redirect('/'), 2000)
        })
    }, [])

    return (
        <>
            {verified
            ? <p>Verified, redirecting...</p>
            : <p>Verifying...</p>}
        </>
    )
}

// Main page component with Suspense boundary
export default function EmailVerifyPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <VerifyEmail />
        </Suspense>
    )
}
