import axiosInstance from "./axiosInstance";
import type { AuthResponse, LoginRequest, RegisterRequest } from "../types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>(
    "/api/auth/login",
    data,
  );
  return response.data;
};

export const register = async (data: RegisterRequest): Promise<void> => {
  await axiosInstance.post("/api/auth/register", data);
};
