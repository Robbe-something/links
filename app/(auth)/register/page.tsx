"use client"

import {getSignUpSchema} from "@/utils/supabase/auth_schema";
import {useForm} from "react-hook-form";
import * as z from "zod/v4";
import {zodResolver} from "@hookform/resolvers/zod";
import {signup} from "@/utils/supabase/auth_actions";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

const signUpSchema = getSignUpSchema()

export default function Page() {
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

    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        await signup(data)
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
                            <FormLabel>confirm password</FormLabel>
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
                            <FormLabel>First Name</FormLabel>
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
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input type="text" className="max-w-xs focus-visible:ring-[3px] focus-visible:ring-blue-500/20 focus-visible:border-blue-500" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Sign Up</Button>
            </form>
        </Form>
    )
}