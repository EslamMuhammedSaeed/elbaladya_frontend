export interface SearchStudent {
  id: string;
  name: string;
  facultyId: string;
}

export interface SearchCourse {
  id: string;
  arabicName: string;
  englishName: string;
}

export interface SearchGroup {
  id: string;
  name: string;
}

export interface SearchAdmin {
  id: string;
  name: string;
}

export interface SearchResults {
  students: SearchStudent[];
  courses: SearchCourse[];
  groups: SearchGroup[];
  admins: SearchAdmin[];
}

export interface GlobalSearchResponse {
  searchModel: SearchResults;
}

export interface SearchResultItem {
  id: string;
  name: string;
  type: "student" | "course" | "group" | "admin";
  subtitle?: string;
  route: string;
}
