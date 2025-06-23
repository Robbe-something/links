"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import CoursesRow from "@/ui/coursesTable/row";
import {ChevronLeft, Plus} from "lucide-react";
import { Button } from "@/components/ui/button";
import CourseDialog from "@/ui/coursesTable/CourseDialog";
import {createClient} from "@/utils/supabase/client";

export default function CoursesTable({
    courses,
    userType,
    onCreateCourse
}: {
    courses: {
        course: {
            id: string
            name: string
            description: string | null
        }
        enrolmentType: {
            description: string
        }
    }[],
    userType?: string,
    onCreateCourse?: () => void
}) {

    const supabase = createClient();

    const saveNewCourse = async (formData: {
        name: string;
        description?: string;
        userIds: string[];
    }) => {
        console.log(formData);

        const courseId = crypto.randomUUID();

        // create a new course in the database
        const { error } = await supabase
            .from('course')
            .insert({
                id: courseId,
                name: formData.name,
                description: formData.description || null,
            })

        if (error) {
            console.log("Error creating course:", error);
            return;
        }


        // find enrolment type for student
        const { data: a, error: enrolmentError } = await supabase
            .from('enrolmentType')
            .select('id')
            .eq('description', 'STUDENT')
            .limit(1);

        if (enrolmentError || !a || a.length === 0) {
            console.log("Error fetching enrolment type:", enrolmentError);
            return;
        }

        // Now insert the enrolments for the users
        const enrolments = formData.userIds.map(userId => ({
            user: userId,
            course: courseId,
            enrolmentType: a[0].id
        }));

        const { error: enrolmentInsertError } = await supabase
            .from('enrolment')
            .insert(enrolments);

        if (enrolmentInsertError) {
            console.log("Error inserting enrolments:", enrolmentInsertError);
            return;
        }

        // Call onCreateCourse to trigger parent refresh
        if (onCreateCourse) {
            onCreateCourse();
        }
    }

    const updateCourse = async (formData: {
        name: string;
        description?: string;
        userIds: string[];
    }, courseId: string) => {
        console.log("Updating course:", courseId, formData);

        // Update the course in the database
        const { error } = await supabase
            .from('course')
            .update({
                name: formData.name,
                description: formData.description || null,
            })
            .eq('id', courseId);

        if (error) {
            console.log("Error updating course:", error);
            return;
        }

        // find enrolment type for student
        const { data: a, error: enrolmentError } = await supabase
            .from('enrolmentType')
            .select('id')
            .eq('description', 'STUDENT')
            .limit(1);

        if (enrolmentError || !a || a.length === 0) {
            console.log("Error fetching enrolment type:", enrolmentError);
            return;
        }

        // Update enrolments for the users
        const enrolments = formData.userIds.map(userId => ({
            user: userId,
            course: courseId,
            enrolmentType: a[0].id // Assuming you want to set all to STUDENT
        }));

        const { error: enrolmentUpdateError } = await supabase
            .from('enrolment')
            .upsert(enrolments, {
                ignoreDuplicates: true,
                onConflict: 'user, course'
            });

        if (enrolmentUpdateError) {
            console.log("Error updating enrolments:", enrolmentUpdateError);
            return;
        }

        // Call onCreateCourse to trigger parent refresh after edit as well
        if (onCreateCourse) {
            onCreateCourse();
        }
    }

    const isTeacher = userType?.toLowerCase() === "teacher";
    return (
        <div className="pt-8 grid w-full [&>div]:max-h-[900px] [&>div]:border [&>div]:rounded-md">
            <Table>
                <TableHeader>
                    <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0 hover:bg-inherit">
                        <TableHead className="font-extrabold text-lg">
                            <div className="flex items-center justify-between">
                                <span>Courses</span>
                            </div>
                        </TableHead>
                            {isTeacher && (
                                <TableHead className="w-10 text-right">
                                <div className="flex justify-end">
                                    <CourseDialog creating={true} onSave={saveNewCourse} asChild>
                                        <button
                                            className={`transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer disabled:cursor-default opacity-100 cursor-pointer`}
                                            aria-label="Create new course"
                                            onClick={() => {}}
                                            type="button"
                                        >
                                            <Plus size={22} />
                                        </button>
                                    </CourseDialog>
                                </div>
                                </TableHead>
                            )}
                    </TableRow>
                </TableHeader>
                <TableBody className="overflow-hidden">
                    {courses
                        .slice() // copy to avoid mutating prop
                        .sort((a, b) => a.course.name.localeCompare(b.course.name))
                        .map(d => (
                            <CoursesRow
                                key={d.course.id}
                                course={{
                                    ...d.course,
                                    description: d.course.description // pass description if present
                                }}
                                enrolmentType={d.enrolmentType}
                                onEditCourse={updateCourse}
                            />
                        ))}
                </TableBody>
            </Table>
        </div>
    )
}
