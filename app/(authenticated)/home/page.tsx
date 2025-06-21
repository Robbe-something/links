export const experimental_ppr = true

import {createClient} from "@/utils/supabase/server";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import CoursesTable from "@/ui/coursesTable/table";

export default async function HomePage() {
    const supabase = await createClient()

    const {data, error} = await supabase
        .from('enrolment')
        .select(`
        course (
            id,
            name
        ),
        enrolmentType (
            description
        )
    `).eq('user', (await supabase.auth.getUser()).data.user?.id!)

    return (
        <CoursesTable courses={data!} />
    )
}