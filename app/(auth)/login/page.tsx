"use client"

import { login } from '@/utils/supabase/auth_actions'
import { type Metadata } from "next";
import {useForm} from "react-hook-form";
import * as z from "zod/v4";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {getSignInSchema} from "@/utils/supabase/auth_schema";

const signInSchema = getSignInSchema()

export default function LoginPage() {
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    async function onSubmit(data: z.infer<typeof signInSchema>) {
        await login(data)
    }

    return (
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
                <Button type="submit">Sign In</Button>
            </form>
        </Form>
    )
}
