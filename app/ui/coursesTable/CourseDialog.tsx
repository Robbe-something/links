import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { X } from "lucide-react"; // Add this for the cross icon

// Define form schema with Zod
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    emails: z.array(z.string().email()),
    userIds: z.array(z.string()) // Add userIds to schema
});

export default function CourseDialog({
    children, 
    creating, 
    asChild, 
    onSave,
    course,
    onDelete
}: {
    children: React.ReactNode, 
    creating: boolean, 
    asChild?: boolean | undefined,
    onSave?: (data: z.infer<typeof formSchema>, courseId?: string) => void,
    course?: {
        id: string
        name: string
        description: string | null
    },
    onDelete?: (courseId: string) => Promise<void>
}) {
    const supabase = createClient();
    const [open, setOpen] = useState(false);

    // Store current user's email
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);

    useEffect(() => {
        // Fetch current user email on mount
        supabase.auth.getUser().then(({ data }) => {
            setCurrentUserEmail(data?.user?.email ?? null);
        });
    }, []);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            emails: [],
            userIds: []
        }
    });

    // Prefill form when editing an existing item
    useEffect(() => {
        // fetch email addresses from the userids given
        if (course && open) {
            supabase
                .from("enrolment")
                .select(
                    `
                        user!user (
                            id,
                            email
                        )
                    `
                )
                .eq("course", course.id)
                .eq("enrolmentType", 1)
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Error fetching user emails:", error);
                        return;
                    }
                    const emails = data?.map(user => user.user?.email) || [];
                    const userIds = data?.map(user => user.user?.id) || [];
                    form.reset({
                        name: course.name,
                        description: course.description || "",
                        emails: emails,
                        userIds: userIds
                    });
                });
        }

        if (!course && open) {
            form.reset({
                name: "",
                description: "",
                emails: [],
                userIds: []
            });
        }
    }, [open]);

    // Handle form submission
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        if (onSave) {
            // Pass item ID if editing an existing item
            if (course) {
                onSave(data, course.id);
            } else {
                onSave(data);
            }
            setOpen(false); // Close the dialog after saving
        }
    };

    // State for the email input box
    const [emailInput, setEmailInput] = useState("");
    const [emailError, setEmailError] = useState<string | null>(null);
    const [addingEmail, setAddingEmail] = useState(false);

    // Add email to the list, fetch userId
    const handleAddEmail = async () => {
        const email = emailInput.trim();
        if (!email) return;
        try {
            // Validate email using zod
            z.string().email().parse(email);
            if (form.getValues("emails").includes(email)) {
                setEmailError("Email already added");
                return;
            }
            if (currentUserEmail && email.toLowerCase() === currentUserEmail.toLowerCase()) {
                setEmailError("You cannot add yourself");
                return;
            }
            setAddingEmail(true);
            // Fetch user by email from Supabase
            const { data, error } = await supabase
                .from("user")
                .select("id")
                .eq("email", email)
                .single();

            if (error || !data?.id) {
                setEmailError("user not found");
                setAddingEmail(false);
                return;
            }
            form.setValue("emails", [...form.getValues("emails"), email]);
            form.setValue("userIds", [...form.getValues("userIds"), data.id]);
            setEmailInput("");
            setEmailError(null);
            setAddingEmail(false);
        } catch {
            setEmailError("Invalid email address");
            setAddingEmail(false);
        }
    };

    // Remove email and userId from the list
    const handleRemoveEmail = (email: string) => {
        const emails = form.getValues("emails");
        const idx = emails.indexOf(email);
        if (idx === -1) return;
        const newEmails = [...emails];
        const newUserIds = [...form.getValues("userIds")];
        newEmails.splice(idx, 1);
        newUserIds.splice(idx, 1);
        form.setValue("emails", newEmails);
        form.setValue("userIds", newUserIds);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{creating ? 'Create a new course' : 'Edit Course'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your course. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email input and list */}
                        <div>
                            <Label htmlFor="email-input">Add Email</Label>
                            <div className="flex gap-2 mt-1">
                                <Input
                                    id="email-input"
                                    type="email"
                                    placeholder="Enter email"
                                    value={emailInput}
                                    onChange={e => {
                                        setEmailInput(e.target.value);
                                        setEmailError(null);
                                    }}
                                    onKeyDown={async e => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            await handleAddEmail();
                                        }
                                    }}
                                    disabled={addingEmail}
                                />
                                <Button
                                    type="button"
                                    onClick={handleAddEmail}
                                    variant="secondary"
                                    disabled={addingEmail}
                                >
                                    {addingEmail ? "Adding..." : "Add"}
                                </Button>
                            </div>
                            {emailError && (
                                <div className="text-sm text-red-500 mt-1">{emailError}</div>
                            )}
                            <div className="mt-3 space-y-1">
                                {form.watch("emails").length > 0 && (
                                    <Label>Emails</Label>
                                )}
                                <ul>
                                    {form.watch("emails").map((email, idx) => (
                                        <li key={email} className="flex items-center justify-between py-1">
                                            <span className="truncate">{email}</span>
                                            <button
                                                type="button"
                                                className="ml-2 text-red-500 hover:text-red-700"
                                                onClick={() => handleRemoveEmail(email)}
                                                aria-label={`Remove ${email}`}
                                            >
                                                <X size={16} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {!creating && course && onDelete && (
                            <section className="mb-4 border border-red-200 rounded p-3 bg-red-50">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-red-700">Danger zone</span>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={async () => {
                                            await onDelete(course.id);
                                            setOpen(false);
                                        }}
                                    >
                                        Delete course
                                    </Button>
                                </div>
                            </section>
                        )}

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
