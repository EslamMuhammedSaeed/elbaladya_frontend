export type FilterType =
  | "text"
  | "password"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "select"
  | "date";

export interface FilterField {
  name: string;
  label: string;
  type: FilterType;
  options?: { label: string; value: string }[]; // Only for select
  translate?: boolean;
}
export interface MetaData {
  total: number;
  last_page: number;
  per_page: number;
  current_page: number;
  from: number;
  to: number;
  path: string;
}
export interface TrainingInfo {
  id: string;
  name: string;
  numberOfTrainees: string;
  precentage: string;
  numberOfPassedTrainees: string;
  entranceCount: string;
  totalSpendedHours: string;
  grade: string;
  gradeKey: string;
  image: string;
}
export interface StudentInfo {
  id: string;
  name: string;
  phone: string;
  facultyId: string;
  totalNumberOfTraingings: string;
  // studentId: string;
  stage: string;
  testResult: string;
  lastTimeTraining: string;
  totalNumberOfHours: string;
  grade: string;
  gradeKey: string;
  adminId?: string;
  groupId?: string;

  lastAttempt?: string;
  badges?: number;
  points?: number;
  group: {
    id: string;
    name: string;
  };
}
export type FailedStudent = {
  row: number;
  reason: string;
  name: string;
  phone: string;
  facultyId: string;
};
export type FailedAdmin = {
  row: number;
  reason: string;
  name: string;
  email: string;
};
export type BulkCreateStudentsResponse = {
  bulkCreateStudents: {
    successCount: number;
    failed: FailedStudent[];
  };
};

export type BulkCreateAdminsResponse = {
  bulkCreateAdmins: {
    successCount: number;
    failed: FailedAdmin[];
  };
};
export interface AdminInfo {
  id: string;
  name: string;
  email: string;
  group: {
    id: string;
    name: string;
  };
}
export interface GroupInfo {
  id: string;
  name: string;
  category: string;
  usersCount: string;
}
export interface Column<T extends object> {
  key: keyof T;
  header: string;
  type?: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}
export interface Student {
  numberOfAttempts: number;
  numberOfAttemptsOnTests: number;
  timeSpentOnExams: number;
  timeSpentTraining: number;
  testResult: number;
  trainingResult: number;
  __typename?: string;
}

export interface Course {
  id: string;
  arabicName: string;
  englishName: string;
  picture: string;
  students: Student[];
  __typename?: string;
}
export interface StudentCourse {
  id?: string;
  numberOfAttempts: number;
  testResult: number;
  timeSpentTraining: number;
  progress?: number;
  trainingResult?: number;
  numberOfAttemptsOnTests?: number;
  timeSpentOnExams?: number;
  course?: {
    arabicName: string;
    englishName: string;
  };
  __typename?: string;
}
export interface StudentMain {
  id: string;
  name: string;
  phone: string;
  facultyId: string;
  lastAttempt: string;
  profilePicture: string;
  stage: string;
  courses: StudentCourse[];
  adminId?: string;
  groupId?: string;
  points?: number;
  badges?: number;
  group: {
    id: string;
    name: string;
  };
  __typename?: string;
}
export interface TableAction<T> {
  renderIf: (row: T) => boolean;
  label: string;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
}
