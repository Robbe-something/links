'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers";

import { createClient } from '@/utils/supabase/server'
import {SignInWithPasswordCredentials, SignUpWithPasswordCredentials} from "@supabase/auth-js";
import * as z from 'zod/v4';
import {
    getNewPasswordSchema,
    getPasswordResetSchema,
    getSignInSchema,
    getSignUpSchema
} from "@/utils/supabase/auth_schema";

const signUpSchema = getSignUpSchema()
const signInSchema = getSignInSchema()
const passwordResetSchema = getPasswordResetSchema()
const newPasswordSchema = getNewPasswordSchema()

export async function login(data: z.infer<typeof signInSchema>) {
    const validatedFields = signInSchema.safeParse({
        ...data,
    })

    if (!validatedFields.success) {
        // this should in theory never happen as the data is already validated client side
        redirect('/error')
    }

    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const signInData: SignInWithPasswordCredentials = {
        email: data.email,
        password: data.password,
    }

    const { error } = await supabase.auth.signInWithPassword(signInData)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(data: z.infer<typeof signUpSchema>) {
    const validatedFields = signUpSchema.safeParse({
        ...data,
    })

    const redirectUrl = `https://${(await headers()).get("X-Forwarded-Host")}/email_verify`

    if (!validatedFields.success) {
        // this should in theory never happen as the data is already validated client side
        redirect('/error')
    }

    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const signUpData: SignUpWithPasswordCredentials = {
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: redirectUrl,
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
            }
        }
    }

    const { error } = await supabase.auth.signUp(signUpData)

    if (error) {
        console.log(error)
        redirect('/error')
    }

    redirect('/email_verify')
}

export async function loginWithCode(code: string) {
    const supabase = await createClient()
    const {data, error} = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
        redirect('/error')
    }
    console.log("exchanged code for session:", data)
}

export async function resetPasswordLink(data: z.infer<typeof passwordResetSchema>)  {
    const supabase = await createClient()
    const {error} = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `https://${(await headers()).get("X-Forwarded-Host")}/reset_password`,
    })

    if (error) {
        console.log(error)
        redirect('/error')
    }
    redirect('/reset_password')
}

export async function resetPassword(data: z.infer<typeof newPasswordSchema>)  {
    const validatedFields = newPasswordSchema.safeParse({
        ...data,
    })

    if (!validatedFields.success) {
        // this should in theory never happen as the data is already validated client side
        redirect('/error')
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.updateUser({
        password: data.password,
    })

    if (error) {
        console.log(error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')

}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}
