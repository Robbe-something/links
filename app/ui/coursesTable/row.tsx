import {TableCell, TableRow} from "@/components/ui/table";
import CourcesCell from "@/ui/coursesTable/cell";
import CourseDescriptionCell from './descriptionCell';
import { Pencil } from "lucide-react";
import CourseDialog from "@/ui/coursesTable/CourseDialog";

export default function CoursesRow({course, enrolmentType, onEditCourse} : {
    course: {
        id: string
        name: string
        description: string | null
    }
    enrolmentType: {
        description: string
    }
    onEditCourse?: (formData: {
        name: string;
        description?: string;
        userIds: string[];
    }, courseId: string) => Promise<void>
}) {
    const isLecturer = enrolmentType.description.toLowerCase() === "lecturer";

    // Wrapper to match ItemDialog's onSave signature
    const handleEditCourse = (formData: {
        name: string;
        description?: string;
        userIds: string[];
    }, courseId?: string) => {
        if (onEditCourse && courseId) {
            // Call and ignore the returned promise
            void onEditCourse(formData, courseId);
        }
    };

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
                    <CourseDialog creating={false} course={course} asChild onSave={handleEditCourse}>
                        <button
                            className="transition-opacity duration-200 p-1 rounded hover:bg-gray-200 flex items-center cursor-pointer"
                            aria-label="Edit course"
                            onClick={() => {}}
                            type="button"
                        >
                            <Pencil size={18} />
                        </button>
                    </CourseDialog>
                </TableCell>
            )}
        </TableRow>
    )
}
