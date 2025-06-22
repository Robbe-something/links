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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Checkbox} from "@/components/ui/checkbox";
import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

// Define form schema with Zod
const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    type: z.string().min(1, "Type is required"),
    visible: z.boolean(),
    link: z.string().optional()
});

export default function ItemDialog({
    children, 
    creating, 
    asChild, 
    onSave,
    item
}: {
    children: React.ReactNode, 
    creating: boolean, 
    asChild?: boolean | undefined,
    onSave?: (data: z.infer<typeof formSchema>, itemId?: string) => void,
    item?: {
        id: string
        title: string
        description: string | null
        link: string | null
        visible: boolean
        type: {
            name: string
            id?: number
        }
    }
}) {
    const supabase = createClient();
    const [docTypes, setDocTypes] = useState<{id: number, name: string}[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [open, setOpen] = useState(false);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "",
            visible: true,
            link: ""
        }
    });

    // Fetch document types
    useEffect(() => {
        const fetchDocTypes = async () => {
            const {data, error} = await supabase
                .from('docType')
                .select('id, name');

            if (error) {
                console.error('Error fetching document types:', error);
                return;
            }

            setDocTypes(data || []);

            // Set default type if available and not editing
            if (data && data.length > 0 && !item) {
                form.setValue('type', data[0].id.toString());
                setSelectedType(data[0].id.toString());
            }
        };

        fetchDocTypes();
    }, []);

    // Prefill form when editing an existing item
    useEffect(() => {
        if (item && open) {
            // Find the type ID from the type name
            const typeId = docTypes.find(type => type.name === item.type.name)?.id;

            // Reset form with item data
            form.reset({
                title: item.title,
                description: item.description || "",
                type: typeId ? typeId.toString() : "",
                visible: item.visible,
                link: item.link || ""
            });

            if (typeId) {
                setSelectedType(typeId.toString());
            }
        } else if (!item && open) {
            // Reset form when creating a new item
            form.reset({
                title: "",
                description: "",
                type: docTypes.length > 0 ? docTypes[0].id.toString() : "",
                visible: true,
                link: ""
            });

            if (docTypes.length > 0) {
                setSelectedType(docTypes[0].id.toString());
            }
        }
    }, [item, open, docTypes]);

    // Handle form submission
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        if (onSave) {
            // Pass item ID if editing an existing item
            if (item) {
                onSave(data, item.id);
            } else {
                onSave(data);
            }
            setOpen(false); // Close the dialog after saving
        }
    };

    // Watch for type changes to conditionally show link field
    const watchType = form.watch("type");
    const isHyperlink = docTypes.find(type => type.id.toString() === watchType)?.name === 'HYPERLINK';

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{creating ? 'Create a new Item' : 'Edit Item'}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your item. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter title" {...field} />
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

                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select 
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedType(value);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {docTypes.map((type) => (
                                                <SelectItem key={type.id} value={type.id.toString()}>
                                                    {type.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {isHyperlink && (
                            <FormField
                                control={form.control}
                                name="link"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Link</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="visible"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>Visible</FormLabel>
                                        <FormDescription>
                                            Make this item visible to students
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            )}
                        />

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
