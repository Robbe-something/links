"use client"

import {TableCell, TableRow} from "@/components/ui/table";
import ItemsCell from "@/ui/items/cell";
import ItemDescriptionCell from './descriptionCell';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Eye, EyeOff, Folder, Link2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function ItemsRow({
    item,
    onItemClick,
    isLecturer
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
    isLecturer?: boolean
}) {
    const isHyperlink = item.type.name === 'HYPERLINK';
    const [hovered, setHovered] = useState(false);
    const [itemVisible, setItemVisible] = useState(item.visible);

    // Function to toggle item visibility
    const toggleVisibility = async () => {
        try {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('item')
                .update({ visible: !itemVisible })
                .eq('id', item.id)
                .select();

            if (error) {
                console.error('Error updating item visibility:', error);
                return;
            }

            // Update local state
            setItemVisible(!itemVisible);
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    // Icon selection based on type
    let typeIcon = null;
    const iconClassName = `text-primary ${!itemVisible ? 'opacity-50' : ''}`;
    if (item.type.name === 'FOLDER') {
        typeIcon = <Folder size={18} className={iconClassName} />;
    } else if (item.type.name === 'HYPERLINK') {
        typeIcon = <Link2 size={18} className={iconClassName} />;
    } else {
        typeIcon = <Folder size={18} className={iconClassName} />; // fallback
    }

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
                    <div className={`font-bold text-lg flex items-center gap-1 ${!itemVisible ? 'opacity-50' : ''}`}>
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
                            aria-label={itemVisible ? "Hide item" : "Show item"}
                            onClick={toggleVisibility}
                            type="button"
                        >
                            {itemVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                            className="transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer"
                            aria-label="Edit item"
                            onClick={() => {}}
                            type="button"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            className="transition-opacity duration-200 p-1 rounded hover:bg-red-200 flex items-center cursor-pointer text-red-600"
                            aria-label="Delete item"
                            onClick={() => {}}
                            type="button"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </TableCell>
            )}
        </TableRow>
    )
}
