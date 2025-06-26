'use client'

import {Suspense, useEffect, useState} from "react";
import {redirect, useSearchParams} from "next/navigation";
import {loginWithCode, resetPassword, resetPasswordLink} from "@/utils/supabase/auth_actions";
import {useForm} from "react-hook-form";
import * as z from "zod/v4";
import {zodResolver} from "@hookform/resolvers/zod";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {getNewPasswordSchema} from "@/utils/supabase/auth_schema";

function ResetPassword() {
    const code = useSearchParams().get('code')

    if (!code) {
        return <p>Please check your inbox to find your password reset email.</p>
    }

    let [verified, setVerified] = useState(false)

    useEffect(() => {
        loginWithCode(code).then(_ => {
            setVerified(true)
        })
    }, [])

    return (
        <>
            {verified
                ? <NewPasswordCard />
                : <p>Verifying...</p>}
        </>
    )
}

const newPasswordSchema = getNewPasswordSchema()

function NewPasswordCard() {
    const form = useForm<z.infer<typeof newPasswordSchema>>({
        resolver: zodResolver(newPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        }
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(data: z.infer<typeof newPasswordSchema>) {
        setIsSubmitting(true);
        try {
            await resetPassword(data)
            redirect('/')
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Create a new password</CardTitle>
                <CardDescription>
                    Enter a new password for your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>password</FormLabel>
                                    <FormControl>
                                        <Input type="password" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>confirm password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button className="w-full" onClick={() => form.handleSubmit(onSubmit)()} disabled={isSubmitting}>
                    {isSubmitting ? "Changing password..." : "Change password"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <ResetPassword />
        </Suspense>
    )
}