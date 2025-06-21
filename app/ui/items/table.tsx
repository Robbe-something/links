"use client"

import {createClient} from "@/utils/supabase/client";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

export default function ItemsTable({course_id} : {course_id: string}) {
    const supabase = createClient();

    const baseQuery = supabase.from('item')
        .select(
            `
                 id,
                title,
                description,
                link,
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
        type: {
            name: string
        }
    }[]>([])
    const [parent, setParent] = useState<string | null>(null)
    useEffect(() => {
        var maybePromise
        if (parent === null) {
            maybePromise = baseQuery.is('parent', null)
        } else {
            maybePromise = baseQuery.eq('parent', parent)
        }
        Promise.resolve(maybePromise).then((value) => {
            setItems(value.data!)
        })
    }, [parent])

    return (<>
        <Button onClick={async () => {
            const {data, error} = await supabase.from('item')
                .select(`parent`)
                .eq(`id`, parent!)
                .limit(1)
                .maybeSingle()

            if (error) {
                console.error(error)
                return
            }
            if (data) {
                setParent(data.parent)
            }
        }} disabled={parent === null}>back</Button>

        <ul>
            {items.map(i => <li key={i.id} onClick={() => {
                setParent(i.id)
            }}>{i.title}</li>)}
        </ul>
    </>)
}