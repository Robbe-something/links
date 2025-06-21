"use client"

import {ReactNode} from "react";
import {TableCell} from "@/components/ui/table";

export default function ItemsCell({children, onClick}: {children: ReactNode, onClick?: () => void}) {
    return (
        <TableCell 
            className="font-semibold cursor-pointer"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {children}
        </TableCell>
    )
}