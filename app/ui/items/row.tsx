"use client"

import {TableCell, TableRow} from "@/components/ui/table";
import ItemsCell from "@/ui/items/cell";
import ItemDescriptionCell from './descriptionCell';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Eye, EyeOff, Folder, Link2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import ItemDialog from "@/ui/items/ItemDialog";

export default function ItemsRow({
    item,
    onItemClick,
    isLecturer,
    onToggleVisibility,
    onDeleteItem,
    onEditItem
}: {
    item: {
        id: string
        title: string
        description: string | null
        link: string | null
        visible: boolean
        type: {
            name: string
        }
    },
    onItemClick: (item: {
        id: string
        title: string
        description: string | null
        link: string | null
        visible: boolean
        type: {
            name: string
        }
    }) => void,
    isLecturer?: boolean,
    onToggleVisibility?: (itemId: string, currentVisibility: boolean) => Promise<void>,
    onDeleteItem?: (itemId: string) => Promise<void>,
    onEditItem?: (formData: {
        title: string;
        description?: string;
        type: string;
        visible: boolean;
        link?: string;
    }, itemId: string) => Promise<void>
}) {
    const isHyperlink = item.type.name === 'HYPERLINK';
    const [hovered, setHovered] = useState(false);
    // We'll use the item's visible property directly since the parent component will handle the state
    const [isDeleted, setIsDeleted] = useState(false);

    // Handle visibility toggle
    const handleToggleVisibility = async () => {
        if (onToggleVisibility) {
            await onToggleVisibility(item.id, item.visible);
        }
    };

    // Handle item deletion
    const handleDeleteItem = async () => {
        if (onDeleteItem) {
            await onDeleteItem(item.id);
            // Still set local deleted state for immediate UI feedback
            setIsDeleted(true);
        }
    };

    // Icon selection based on type
    let typeIcon = null;
    const iconClassName = `text-primary ${!item.visible ? 'opacity-50' : ''}`;
    if (item.type.name === 'FOLDER') {
        typeIcon = <Folder size={18} className={iconClassName} />;
    } else if (item.type.name === 'HYPERLINK') {
        typeIcon = <Link2 size={18} className={iconClassName} />;
    } else {
        typeIcon = <Folder size={18} className={iconClassName} />; // fallback
    }

    // If the item is deleted, don't render anything
    if (isDeleted) {
        return null;
    }

    // Wrapper to match ItemDialog's onSave signature
    const handleEditItem = (formData: {
        title: string;
        description?: string;
        type: string;
        visible: boolean;
        link?: string;
    }, itemId?: string) => {
        if (onEditItem && itemId) {
            // Call and ignore the returned promise
            void onEditItem(formData, itemId);
        }
    };

    return (
        <TableRow className="[&>*]:whitespace-nowrap"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <ItemsCell onClick={() => onItemClick(item)}>
                <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarFallback>
                            {typeIcon}
                        </AvatarFallback>
                    </Avatar>
                    <div className={`font-bold text-lg flex items-center gap-1 ${!item.visible ? 'opacity-50' : ''}`}>
                        {item.title}
                        {isHyperlink && hovered && (
                            <ExternalLink size={18} className="ml-1 text-muted-foreground" />
                        )}
                    </div>
                </div>
                <ItemDescriptionCell description={item.description} />
            </ItemsCell>
            {isLecturer && (
                <TableCell className="w-20">
                    <div className="flex space-x-2">
                        <button
                            className="transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer"
                            aria-label={item.visible ? "Hide item" : "Show item"}
                            onClick={handleToggleVisibility}
                            type="button"
                        >
                            {item.visible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <ItemDialog creating={false} asChild onSave={handleEditItem} item={item}>
                            <button
                                className="transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer"
                                aria-label="Edit item"
                                type="button"
                            >
                                <Pencil size={18} />
                            </button>
                        </ItemDialog>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <button
                                    className="transition-opacity duration-200 p-1 rounded hover:bg-red-200 flex items-center cursor-pointer text-red-600"
                                    aria-label="Delete item"
                                    type="button"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the
                                        item.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={async () => {
                                            if (onDeleteItem) {
                                                await onDeleteItem(item.id);
                                                setIsDeleted(true);
                                            }
                                        }}
                                    >Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </TableCell>
            )}
        </TableRow>
    )
}
