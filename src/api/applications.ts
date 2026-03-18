import axiosInstance from "./axiosInstance";
import type {
  Application,
  ApplicationPageResponse,
  ApplicationRequest,
} from "../types";

export const getApplications = async (
  page = 0,
  size = 10,
  status?: string,
  company?: string,
): Promise<ApplicationPageResponse> => {
  const response = await axiosInstance.get<ApplicationPageResponse>(
    "/applications",
    {
      params: { page, size, status, company },
    },
  );
  return response.data;
};

export const getApplication = async (id: number): Promise<Application> => {
  const response = await axiosInstance.get<Application>(`/applications/${id}`);
  return response.data;
};

export const createApplication = async (
  data: ApplicationRequest,
): Promise<Application> => {
  const response = await axiosInstance.post<Application>("/applications", data);
  return response.data;
};

export const updateApplication = async (
  id: number,
  data: ApplicationRequest,
): Promise<Application> => {
  const response = await axiosInstance.put<Application>(
    `/applications/${id}`,
    data,
  );
  return response.data;
};

export const deleteApplication = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/applications/${id}`);
};
