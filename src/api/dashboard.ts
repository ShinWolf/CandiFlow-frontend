import axiosInstance from "./axiosInstance";

export interface DashboardStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
  interviewRate: number;
  offerRate: number;
}

export const getStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get<DashboardStats>(
    "/api/dashboard/stats",
  );
  return response.data;
};
