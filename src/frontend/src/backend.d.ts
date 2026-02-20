import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MCQPracticeResult {
    score: number;
    totalQuestions: bigint;
    correctAnswers: bigint;
}
export interface SearchResult {
    questionPapers: Array<QuestionPaper>;
    subjects: Array<Subject>;
    mcqs: Array<MCQ>;
    notes: Array<Notes>;
}
export interface MCQ {
    id: bigint;
    question: string;
    explanation?: string;
    correctAnswer: bigint;
    subjectId: bigint;
    options: Array<string>;
}
export interface Syllabus {
    overview: string;
    subjectId: bigint;
}
export interface MCQAnswer {
    mcqId: bigint;
    selectedAnswer: bigint;
}
export interface QuestionPaper {
    id: bigint;
    file: ExternalBlob;
    year: bigint;
    subjectId: bigint;
    examType?: string;
}
export interface Notes {
    id: bigint;
    title: string;
    file: ExternalBlob;
    tags: Array<string>;
    year: bigint;
    subjectId: bigint;
}
export interface Semester {
    id: bigint;
    number: bigint;
    branchId: bigint;
}
export interface Branch {
    id: bigint;
    name: string;
}
export interface Subject {
    id: bigint;
    name: string;
    semesterId: bigint;
    branchId: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addBranch(name: string): Promise<bigint>;
    addMCQ(subjectId: bigint, question: string, options: Array<string>, correctAnswer: bigint, explanation: string | null): Promise<bigint>;
    addNotes(subjectId: bigint, title: string, year: bigint, tags: Array<string>, file: ExternalBlob): Promise<bigint>;
    addQuestionPaper(subjectId: bigint, year: bigint, examType: string | null, file: ExternalBlob): Promise<bigint>;
    addSemester(branchId: bigint, number: bigint): Promise<bigint>;
    addSubject(branchId: bigint, semesterId: bigint, name: string): Promise<bigint>;
    addSyllabus(subjectId: bigint, overview: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteBranch(id: bigint): Promise<void>;
    deleteMCQ(id: bigint): Promise<void>;
    deleteNotes(id: bigint): Promise<void>;
    deleteQuestionPaper(id: bigint): Promise<void>;
    deleteSemester(id: bigint): Promise<void>;
    deleteSubject(id: bigint): Promise<void>;
    deleteSyllabus(subjectId: bigint): Promise<void>;
    evaluateMCQAnswers(answers: Array<MCQAnswer>): Promise<MCQPracticeResult>;
    getBranch(id: bigint): Promise<Branch | null>;
    getBranches(): Promise<Array<Branch>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMCQById(id: bigint): Promise<MCQ | null>;
    getMCQsBySubject(subjectId: bigint): Promise<Array<MCQ>>;
    getNotesById(id: bigint): Promise<Notes | null>;
    getNotesBySubject(subjectId: bigint): Promise<Array<Notes>>;
    getQuestionPaperById(id: bigint): Promise<QuestionPaper | null>;
    getQuestionPapersBySubject(subjectId: bigint): Promise<Array<QuestionPaper>>;
    getSemesters(): Promise<Array<Semester>>;
    getSemestersByBranch(branchId: bigint): Promise<Array<Semester>>;
    getSubject(id: bigint): Promise<Subject | null>;
    getSubjects(): Promise<Array<Subject>>;
    getSubjectsBySemester(semesterId: bigint): Promise<Array<Subject>>;
    getSyllabusBySubject(subjectId: bigint): Promise<Syllabus | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    search(searchTerm: string): Promise<SearchResult>;
    updateBranch(id: bigint, name: string): Promise<void>;
    updateMCQ(id: bigint, subjectId: bigint, question: string, options: Array<string>, correctAnswer: bigint, explanation: string | null): Promise<void>;
    updateNotes(id: bigint, subjectId: bigint, title: string, year: bigint, tags: Array<string>, file: ExternalBlob): Promise<void>;
    updateQuestionPaper(id: bigint, subjectId: bigint, year: bigint, examType: string | null, file: ExternalBlob): Promise<void>;
    updateSemester(id: bigint, branchId: bigint, number: bigint): Promise<void>;
    updateSubject(id: bigint, branchId: bigint, semesterId: bigint, name: string): Promise<void>;
    updateSyllabus(subjectId: bigint, overview: string): Promise<void>;
}
