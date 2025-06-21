import {TableCell, TableRow} from "@/components/ui/table";
import CourcesCell from "@/ui/coursesTable/cell";

export default function CoursesRow({course, enrolmentType} : {
    course: {
        id: string
        name: string
    }
    enrolmentType: {
        description: string
    }
}) {
    return (
        <TableRow key={course.id} className="[&>*]:whitespace-nowrap">
            <CourcesCell href={`/course/${course.name}`}>{course.name}</CourcesCell>
        </TableRow>

        // <CoursesLink href={`/course/${course.name}`}>ajsofisja;</CoursesLink>
    )
}