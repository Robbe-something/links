import {Metadata} from "next";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import ItemsTable from "@/ui/items/table";

export async function generateMetadata({params}: { params: Promise<{ directory: string }> }): Promise<Metadata> {
    const {directory} = await params
    return {
        title: `Links - ${decodeURIComponent(directory)}`
    }
}

export default async function Page({
                                       params
                                   }: {
    params: Promise<{ directory: string }>
}) {
    const {directory} = await params
    const course = decodeURIComponent(directory)

    const supabase = await createClient()

    let {data, error} = await supabase.from('course')
        .select(`
            id,
            name
        `)
        .eq('name', course)
        .limit(1)
        .maybeSingle()

    if (error) {
        redirect('/error')
    }

    if (!data) {
        return (<>
                <p>Course not found</p>
                <Link href="/home"><Button>Go to your courses</Button></Link>
            </>)
    }

    const course_id = data?.id

    const l = await supabase.from('item')
        .select(`
            id,
            title,
            description,
            link,
            type (
                name
            )
        `)
        .eq('course', course_id)
        .is('parent', null)

    console.log(l.data)
    console.log(l.error)

    return (
        <div className="px-4 sm:px-10 lg:px-20">
            <ItemsTable course_id={course_id} />
        </div>
    )
}