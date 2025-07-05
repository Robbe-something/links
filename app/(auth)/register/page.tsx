"use client"

import {getSignUpSchema} from "@/utils/supabase/auth_schema";
import {useForm} from "react-hook-form";
import * as z from "zod/v4";
import {zodResolver} from "@hookform/resolvers/zod";
import {signup} from "@/utils/supabase/auth_actions";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {useState} from "react";
import { useTranslation } from "@/lib/i18n/context";

const signUpSchema = getSignUpSchema()

export default function Page() {
    const { t } = useTranslation();
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: ""
        }
    })
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await signup(data)
            if (result?.error) {
                setError(result.error);
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{t('auth.registerTitle')}</CardTitle>
                <CardDescription>
                    {t('auth.registerDescription')}
                </CardDescription>
                <CardAction>
                    <Link href="/login"><Button variant="link">{t('auth.logIn')}</Button></Link>
                </CardAction>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form id="register-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.email')}</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="example@email.com" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.password')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="new-password" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
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
                                    <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                                    <FormControl>
                                        <Input type="password" autoComplete="new-password" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.firstName')}</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('auth.lastName')}</FormLabel>
                                    <FormControl>
                                        <Input type="text" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button form="register-form" type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? t('auth.registering') : t('auth.registerButton')}
                </Button>
            </CardFooter>
        </Card>
    )
}