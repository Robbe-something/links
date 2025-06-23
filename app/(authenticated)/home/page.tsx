"use client"

import { useEffect, useState, useCallback } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import CoursesTable from "@/ui/coursesTable/table";

export default function HomePage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [userType, setUserType] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const fetchCourses = useCallback(async () => {
        setLoading(true);
        const user = await supabase.auth.getUser();
        const { data, error } = await supabase
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
            `)
            .eq('user', user.data.user?.id!);
        if (error) {
            redirect('/error');
        }
        setCourses(data || []);
        setLoading(false);
    }, [supabase]);

    const fetchUserType = useCallback(async () => {
        const user = await supabase.auth.getUser();
        const { data: userData, error: userError } = await supabase
            .from('user')
            .select(`userRole ( description )`)
            .eq('id', user?.data.user?.id!)
            .maybeSingle();
        setUserType(userError ? undefined : userData?.userRole?.description);
    }, [supabase]);

    useEffect(() => {
        fetchCourses();
        fetchUserType();
    }, [fetchCourses, fetchUserType]);

    return (
        <div className="px-4 sm:px-10 lg:px-20">
            <CoursesTable
                courses={courses}
                userType={userType}
                onCreateCourse={fetchCourses}
            />
        </div>
    );
}