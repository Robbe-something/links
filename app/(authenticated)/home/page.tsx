import {redirect} from "next/navigation";

export const experimental_ppr = true

import {createClient} from "@/utils/supabase/server";
import {Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import CoursesTable from "@/ui/coursesTable/table";

export default async function HomePage() {
    const supabase = await createClient()
    const user = await supabase.auth.getUser();

    const {data, error} = await supabase
        .from('enrolment')
        .select(`
        course (
            id,
            name,
            description
        ),
        enrolmentType (
            description
        )
    `).eq('user', user.data.user?.id!)

    if (error) {
        redirect('/error')
    }

    // Fetch user role (teacher/student/etc)
    const { data: userData, error: userError } = await supabase
        .from('user')
        .select(`userRole ( description )`)
        .eq('id', user?.data.user?.id!)
        .maybeSingle();
    const userType = userError ? undefined : userData?.userRole?.description

    return (
        <div className="px-4 sm:px-10 lg:px-20">
            <CoursesTable
                courses={data!}
                userType={userType}
            />
        </div>
    )
}