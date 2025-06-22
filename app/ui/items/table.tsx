"use client"

import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Table, TableBody, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import ItemsRow from "@/ui/items/row";
import { ChevronLeft } from "lucide-react";
import { Plus } from "lucide-react";

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
            setItems(value.data!)
        })
    }, [parent])

    const handleItemClick = (item: {
        id: string
        title: string
        description: string | null
        link: string | null
        visible: boolean
        type: { name: string }
    }) => {
        if (item.type.name === 'FOLDER') {
            setParent(item.id);
        } else if (item.type.name === 'HYPERLINK' && item.link) {
            window.open(item.link, '_blank', 'noopener,noreferrer');
        }
    }

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
                                    <button
                                        className={`transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer disabled:cursor-default opacity-100 cursor-pointer`}
                                        aria-label="Create new Item"
                                        onClick={() => {}}
                                        type="button"
                                    >
                                        <Plus size={22} />
                                    </button>
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
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
