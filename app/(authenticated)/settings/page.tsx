"use client"

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {useEffect, useState} from "react";
import {createClient as createSupabaseClient} from "@/utils/supabase/client";

const profileSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
});

const passwordSchema = z.object({
    password: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match", path: ["confirmNewPassword"],
});

export default function SettingsPage() {
    const [deleting, setDeleting] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const supabase = createSupabaseClient();

    const profileForm = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema), defaultValues: {firstName: "", lastName: "", email: ""},
    });

    const passwordForm = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema), defaultValues: {password: "", newPassword: "", confirmNewPassword: ""},
    });

    useEffect(() => {
        async function fetchProfile() {
            const {data: {session}} = await supabase.auth.getSession();
            if (!session) return;
            const {first_name, last_name} = (await supabase.auth.getUser())?.data.user?.user_metadata as {
                first_name: string,
                last_name: string
            };
            profileForm.reset({
                firstName: first_name, lastName: last_name, email: session.user.email || "",
            });
        }

        fetchProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function onProfileSubmit(inputData: z.infer<typeof profileSchema>) {
        // Update user profile in Supabase
        const {data, error} = await supabase.auth.updateUser({
            data: {
                first_name: inputData.firstName,
                last_name: inputData.lastName,
            },
            email: inputData.email,
        })

        if (error) {
            console.error("Error updating profile:", error);
            return;
        }
        // Reload the page to update the navbar with the new name
        window.location.reload();
    }

    async function onPasswordSubmit(inputData: z.infer<typeof passwordSchema>) {
        setPasswordError(null);
        const {data, error} = await supabase.rpc('change_user_password', {
            'current_plain_password': inputData.password,
            'new_plain_password': inputData.newPassword
        })
        if (error) {
            setPasswordError(error.message);
            return;
        }
        setPasswordError(null);
        // Optionally show a success message here
        console.log("Password changed successfully:", data);
    }

    async function handleDeleteAccount() {
        setDeleting(true);
        // TODO: Implement account deletion logic
        setDeleting(false);
    }

    return (<div className="max-w-xl mx-auto py-12">
            <h1 className="text-2xl font-bold mb-8">Settings</h1>
            {/* Profile Update Form */}
            <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                            control={profileForm.control}
                            name="firstName"
                            render={({field}) => (<FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                        />
                        <FormField
                            control={profileForm.control}
                            name="lastName"
                            render={({field}) => (<FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>)}
                        />
                    </div>
                    <FormField
                        disabled
                        control={profileForm.control}
                        name="email"
                        render={({field}) => (<FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input type="email" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>)}
                    />
                    <Button type="submit" className="w-full md:w-auto">Update Profile</Button>
                </form>
            </Form>
            <div className="mt-12 border-t pt-8">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={passwordForm.control}
                                name="password"
                                render={({field}) => (<FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" autoComplete="current-password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({field}) => (<FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                            />
                            <FormField
                                control={passwordForm.control}
                                name="confirmNewPassword"
                                render={({field}) => (<FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" autoComplete="new-password" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>)}
                            />
                        </div>
                        {passwordError && (
                          <div className="text-red-600 text-sm">{passwordError}</div>
                        )}
                        <Button type="submit" className="w-full md:w-auto">Change Password</Button>
                    </form>
                </Form>
            </div>
            {/* Danger Zone */}
            <div className="mt-12 border-t pt-8">
                <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
                <Button variant="destructive" onClick={handleDeleteAccount} disabled>
                    {deleting ? "Deleting..." : "Delete Account"}
                </Button>
            </div>
        </div>);
}