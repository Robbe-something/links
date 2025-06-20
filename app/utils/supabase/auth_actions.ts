'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from "next/headers";

import { createClient } from '@/utils/supabase/server'
import {SignInWithPasswordCredentials, SignUpWithPasswordCredentials} from "@supabase/auth-js";
import * as z from 'zod/v4';
import {getSignUpSchema} from "@/utils/supabase/auth_schema";

const signUpSchema = getSignUpSchema()

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data: SignInWithPasswordCredentials = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

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

    console.log((await headers()).get("X-Forwarded-Host"))

    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error).properties
        }
    }

    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const signUpData: SignUpWithPasswordCredentials = {
        email: data.email,
        password: data.password,
        options: {
            emailRedirectTo: `https://${(await headers()).get("X-Forwarded-Host")}/email_verify`,
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