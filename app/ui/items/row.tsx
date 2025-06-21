"use client"

import {TableRow} from "@/components/ui/table";
import ItemsCell from "@/ui/items/cell";
import ItemDescriptionCell from './descriptionCell';

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
    onItemClick: (id: string) => void
}) {
    return (
        <TableRow className="[&>*]:whitespace-nowrap">
            <ItemsCell onClick={() => onItemClick(item.id)}>
                <div className="font-bold text-lg">
                    {item.title} <span className="font-bold">({item.type.name})</span>
                </div>
                <ItemDescriptionCell description={item.description} />
            </ItemsCell>
        </TableRow>
    )
}
