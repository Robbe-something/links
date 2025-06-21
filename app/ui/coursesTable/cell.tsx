"use client"

import {ReactNode} from "react";
import {TableCell} from "@/components/ui/table";
import {redirect} from "next/navigation";

export default function CourcesCell({children, href}: {children: ReactNode, href: string}) {
    return (
        <TableCell className="font-semibold cursor-pointer" onClick={() => redirect(href)}>{children}</TableCell>
    )
}