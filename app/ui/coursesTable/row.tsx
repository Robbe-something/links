import {TableCell, TableRow} from "@/components/ui/table";
import CourcesCell from "@/ui/coursesTable/cell";
import CourseDescriptionCell from './descriptionCell';
import { Pencil } from "lucide-react";

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
    const isLecturer = enrolmentType.description.toLowerCase() === "lecturer";

    return (
        <TableRow key={course.id} className="[&>*]:whitespace-nowrap">
            <CourcesCell href={`/course/${course.name}`}>
                <div className="font-bold text-lg">
                    {course.name}
                </div>
                <CourseDescriptionCell description={course.description} />
            </CourcesCell>
            {isLecturer && (
                <TableCell className="w-10">
                    <button
                        className="transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer"
                        aria-label="Edit course"
                        onClick={() => {}}
                        type="button"
                    >
                        <Pencil size={18} />
                    </button>
                </TableCell>
            )}
        </TableRow>
    )
}
