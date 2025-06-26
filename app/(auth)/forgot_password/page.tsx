'use client'

import {useForm} from "react-hook-form";
import * as z from "zod/v4";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {login, resetPasswordLink} from "@/utils/supabase/auth_actions";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {getPasswordResetSchema} from "@/utils/supabase/auth_schema";

const passwordResetSchema = getPasswordResetSchema()

export default function ForgotPasswordPage() {
    const form = useForm<z.infer<typeof passwordResetSchema>>({
        resolver: zodResolver(passwordResetSchema),
        defaultValues: {
            email: "",
        }
    })

    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(data: z.infer<typeof passwordResetSchema>) {
        setIsSubmitting(true);
        try {
            await resetPasswordLink(data)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Forgot you password?</CardTitle>
                <CardDescription>
                    Enter your email to receive a password reset link.
                </CardDescription>
                <CardAction>
                    <Link href="/login"><Button variant="link">Log in</Button></Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>email</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="example@email.com" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
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
                    {isSubmitting ? "Sending Link..." : "Send Link"}
                </Button>
            </CardFooter>
        </Card>
    )
}