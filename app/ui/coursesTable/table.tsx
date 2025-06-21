import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import CoursesRow from "@/ui/coursesTable/row";

export default function CoursesTable ({
    courses
}: {
    courses: {
        course: {
            id: string
            name: string
            description: string | null // make description optional
        }
        enrolmentType: {
            description: string
        }
    }[]
}) {
    return (
        <div className="pt-8 grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded-md">
            <Table>
                <TableHeader>
                    <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0 hover:bg-inherit">
                        <TableHead className="w-full font-extrabold text-lg">Courses</TableHead>
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