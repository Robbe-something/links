import {TableCell, TableRow} from "@/components/ui/table";
import CourcesCell from "@/ui/coursesTable/cell";
import CourseDescriptionCell from './descriptionCell';

export default function CoursesRow({course, enrolmentType} : {
    course: {
        id: string
        name: string
        description: string | null
    }
    enrolmentType: {
        description: string
    }
}) {
    return (
        <TableRow key={course.id} className="[&>*]:whitespace-nowrap">
            <CourcesCell href={`/course/${course.name}`}>
                <div className="font-bold text-lg">
                    {course.name} <span className="font-bold">({enrolmentType.description})</span>
                </div>
                <CourseDescriptionCell description={course.description} />
            </CourcesCell>
        </TableRow>
    )
}