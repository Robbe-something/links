import {Metadata} from "next";
import {createClient} from "@/utils/supabase/server";
import {redirect} from "next/navigation";
import Link from "next/link";
import {Button} from "@/components/ui/button";

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

    const {data, error} = await supabase.from('course')
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

    return (<p>{course_id}</p>)
}