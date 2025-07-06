"use client"

import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import ItemsRow from "@/ui/items/row";
import { ChevronLeft } from "lucide-react";
import { Plus } from "lucide-react";
import ItemDialog from "@/ui/items/ItemDialog";
import { toast } from "sonner";

export default function ItemsTable({course_id, isLecturer}: {course_id: string, isLecturer: boolean}) {
    const supabase = createClient();

    const baseQuery = supabase.from('item')
        .select(
            `
                 id,
                title,
                description,
                link,
                visible,
                parent,
                type (
                    name
                )
            `
        )
        .eq('course', course_id)

    const [items, setItems] = useState<{
        id: string
        title: string
        description: string | null
        link: string | null
        visible: boolean
        parent: string | null
        type: {
            name: string
        }
    }[]>([])
    const [parent, setParent] = useState<string | null>(null)
    const [parentTitle, setParentTitle] = useState<string | null>(null)

    useEffect(() => {
        var maybePromise
        if (parent === null) {
            maybePromise = baseQuery.is('parent', null)
            setParentTitle(null)
        } else {
            maybePromise = baseQuery.eq('parent', parent)
            // Fetch the parent title
            supabase.from('item').select('title').eq('id', parent).maybeSingle().then(({data}) => {
                setParentTitle(data?.title || null)
            })
        }
        Promise.resolve(maybePromise).then((value) => {
            // Sort items alphabetically by title before setting state
            const sortedItems = (value.data || []).slice().sort((a, b) => {
                if (!a.title) return 1;
                if (!b.title) return -1;
                return a.title.localeCompare(b.title);
            });
            setItems(sortedItems)
        })
    }, [parent])

    const handleItemClick = (item: {
        id: string
        title: string
        description: string | null
        link: string | null
        visible: boolean
        parent: string | null
        type: { name: string }
    }) => {
        if (item.type.name === 'FOLDER') {
            setParent(item.id);
        } else if (item.type.name === 'HYPERLINK' && item.link) {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        }
    }

    // Function to toggle item visibility
    const toggleVisibility = async (itemId: string, currentVisibility: boolean) => {
        try {
            const { data, error } = await supabase
                .from('item')
                .update({ visible: !currentVisibility })
                .eq('id', itemId)
                .select();

            if (error) {
                console.error('Error updating item visibility:', error);
                return;
            }

            // Update items state with the new visibility
            setItems(items.map(item => 
                item.id === itemId 
                    ? { ...item, visible: !currentVisibility } 
                    : item
            ));
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    // Function to delete item
    const deleteItem = async (itemId: string) => {
        try {
            const { error } = await supabase
                .from('item')
                .delete()
                .eq('id', itemId);

            if (error) {
                console.error('Error deleting item:', error);
                return;
            }

            // Remove the deleted item from the items state
            setItems(items.filter(item => item.id !== itemId));
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    // Function to save a new item
    const saveNewItem = async (formData: {
        title: string;
        description?: string;
        type: string;
        visible: boolean;
        link?: string;
        parent?: string;
    }, itemId?: string) => {
        try {
            // Create new item with current parent
            const { data, error } = await supabase
                .from('item')
                .insert({
                    title: formData.title,
                    description: formData.description || null,
                    type: parseInt(formData.type),
                    visible: formData.visible,
                    link: formData.link || null,
                    parent: formData.parent === 'null' ? null : formData.parent || parent,
                    course: course_id
                })
                .select();

            if (error) {
                console.error('Error creating item:', error);
                toast("Error",{
                    description: "Failed to create item: " + error.message
                });
                return;
            }

            // Refresh the items list
            const maybePromise = parent === null 
                ? baseQuery.is('parent', null) 
                : baseQuery.eq('parent', parent);

            const { data: refreshedItems } = await maybePromise;
            if (refreshedItems) {
                // Sort items alphabetically by title before setting state
                const sortedItems = refreshedItems.slice().sort((a, b) => {
                    if (!a.title) return 1;
                    if (!b.title) return -1;
                    return a.title.localeCompare(b.title);
                });
                setItems(sortedItems);
            }

            toast("Success", {
                description: "Item created successfully",
            });
        } catch (error) {
            console.error('Error saving item:', error);
            toast("Error", {
                description: "An unexpected error occurred",
            });
        }
    };

    // Function to update an existing item
    const updateItem = async (formData: {
        title: string;
        description?: string;
        type: string;
        visible: boolean;
        link?: string;
        parent?: string;
    }, itemId: string) => {
        try {
            // Update the existing item
            const { data, error } = await supabase
                .from('item')
                .update({
                    title: formData.title,
                    description: formData.description || null,
                    type: parseInt(formData.type),
                    visible: formData.visible,
                    link: formData.link || null,
                    parent: formData.parent === 'null' ? null : formData.parent
                })
                .eq('id', itemId)
                .select();

            if (error) {
                console.error('Error updating item:', error);
                toast("Error", {
                    description: "Failed to update item: " + error.message
                });
                return;
            }

            // Refresh the items list
            const maybePromise = parent === null 
                ? baseQuery.is('parent', null) 
                : baseQuery.eq('parent', parent);

            const { data: refreshedItems } = await maybePromise;
            if (refreshedItems) {
                setItems(refreshedItems);
            }

            toast("Success", {
                description: "Item updated successfully",
            });
        } catch (error) {
            console.error('Error updating item:', error);
            toast("Error", {
                description: "An unexpected error occurred",
            });
        }
    };

    return (
        <div className="pt-8 grid w-full [&>div]:max-h-[500px] [&>div]:border [&>div]:rounded-md">
            <Table>
                <TableHeader>
                    <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0 hover:bg-inherit">
                        <TableHead className="font-extrabold text-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        className={`transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer disabled:cursor-default ${parent ? 'opacity-100 cursor-pointer' : 'opacity-40 cursor-default'}`}
                                        disabled={!parent}
                                        aria-label="Go up one folder"
                                        onClick={async (e) => {
                                            if (!parent) return;
                                            e.stopPropagation();
                                            const {data, error} = await supabase.from('item')
                                                .select(`parent`)
                                                .eq(`id`, parent!)
                                                .limit(1)
                                                .maybeSingle();
                                            if (error) {
                                                console.error(error);
                                                return;
                                            }
                                            if (data) {
                                                setParent(data.parent);
                                            }
                                        }}
                                        type="button"
                                    >
                                        <ChevronLeft size={22} />
                                    </button>
                                    {parent ? (parentTitle ? parentTitle : '...') : 'Root'}
                                </div>
                            </div>
                        </TableHead>
                            {isLecturer && (
                                <TableHead className="w-20 text-right">
                                <div className="flex justify-end">
                                    <ItemDialog creating={true} asChild onSave={saveNewItem} course_id={course_id} item={{parent: parent}}>
                                        <button
                                            className={`transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer disabled:cursor-default opacity-100 cursor-pointer`}
                                            aria-label="Create new Item"
                                            type="button"
                                        >
                                            <Plus size={22} />
                                        </button>
                                    </ItemDialog>
                                </div>
                                </TableHead>
                            )}
                    </TableRow>
                </TableHeader>
                <TableBody className="overflow-hidden">
                    {items.map(item => (
                        <ItemsRow
                            key={item.id}
                            item={item}
                            onItemClick={handleItemClick}
                            isLecturer={isLecturer}
                            onToggleVisibility={toggleVisibility}
                            onDeleteItem={deleteItem}
                            onEditItem={updateItem}
                            course_id={course_id}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
