"use client"

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import CoursesRow from "@/ui/coursesTable/row";
import {ChevronLeft, Plus} from "lucide-react";
import { Button } from "@/components/ui/button";

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
    const isTeacher = userType?.toLowerCase() === "teacher";
    return (
        <div className="pt-8 grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded-md">
            <Table>
                <TableHeader>
                    <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0 hover:bg-inherit">
                        <TableHead className="w-full font-extrabold text-lg flex items-center justify-between">
                            <span>Courses</span>
                            {isTeacher && (
                                <button
                                    className={`transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer disabled:cursor-default opacity-100 cursor-pointer`}
                                    aria-label="Create new course"
                                    onClick={() => {}}
                                    type="button"
                                >
                                    <Plus size={22} />
                                </button>
                            )}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="overflow-hidden">
                    {courses.map(d => (
                        <CoursesRow
                            key={d.course.id}
                            course={{
                                ...d.course,
                                description: d.course.description // pass description if present
                            }}
                            enrolmentType={d.enrolmentType}
                        />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}