export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface Application {
  id: number;
  company: string;
  jobTitle: string;
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  notes?: string;
  offerUrl?: string;
  appliedAt: string;
}

export interface ApplicationPageResponse {
  content: Application[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface ApplicationRequest {
  company: string;
  jobTitle: string;
  status: "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";
  notes?: string;
  offerUrl?: string;
  appliedAt: string;
}
