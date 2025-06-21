"use client"

import {TableRow} from "@/components/ui/table";
import ItemsCell from "@/ui/items/cell";
import ItemDescriptionCell from './descriptionCell';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ExternalLink, Folder, Link2 } from "lucide-react";
import { useState } from "react";

export default function ItemsRow({
    item,
    onItemClick
}: {
    item: {
        id: string
        title: string
        description: string | null
        link: string | null
        type: {
            name: string
        }
    },
    onItemClick: (item: {
        id: string
        title: string
        description: string | null
        link: string | null
        type: {
            name: string
        }
    }) => void
}) {
    const isHyperlink = item.type.name === 'HYPERLINK';
    const [hovered, setHovered] = useState(false);

    // Icon selection based on type
    let typeIcon = null;
    if (item.type.name === 'FOLDER') {
        typeIcon = <Folder size={18} className="text-primary" />;
    } else if (item.type.name === 'HYPERLINK') {
        typeIcon = <Link2 size={18} className="text-primary" />;
    } else {
        typeIcon = <Folder size={18} className="text-primary" />; // fallback
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
                    <div className="font-bold text-lg flex items-center gap-1">
                        {item.title}
                        {isHyperlink && hovered && (
                            <ExternalLink size={18} className="ml-1 text-muted-foreground" />
                        )}
                    </div>
                </div>
                <ItemDescriptionCell description={item.description} />
            </ItemsCell>
        </TableRow>
    )
}
