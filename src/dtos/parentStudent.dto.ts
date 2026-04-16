// CREATE
export interface CreateParentStudentDto {
    parentId: string;
    studentId: string;
}

// UPDATE (rarement utile mais on garde propre)
export interface UpdateParentStudentDto {
    parentId?: string;
    studentId?: string;
}