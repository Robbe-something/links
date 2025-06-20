'use client'

import {redirect, useSearchParams} from "next/navigation";

import { loginWithCode } from "@/utils/supabase/auth_actions";
import {useEffect, useState} from "react";

export default function EmailVerifyPage() {
    const code= useSearchParams().get('code')
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