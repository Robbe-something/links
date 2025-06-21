import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import CoursesRow from "@/ui/coursesTable/row";

export default function CoursesTable ({
                                   courses
                               }: {
    courses: {
        course: {
            id: string
            name: string
        }
        enrolmentType: {
            description: string
        }
    }[]
}) {
return (
    <div className="grid w-full [&>div]:max-h-[300px] [&>div]:border [&>div]:rounded-md">
        <Table>
            <TableHeader>
                <TableRow className="[&>*]:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
                    <TableHead className="w-full font-extrabold">Courses</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody className="overflow-hidden">
                {courses.map(d => <CoursesRow key={d.course.id} course={d.course} enrolmentType={d.enrolmentType} />)}
            </TableBody>
        </Table>
    </div>
)
}