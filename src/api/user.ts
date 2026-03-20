import axiosInstance from "./axiosInstance";

export interface UserProfile {
  email: string;
  username: string | null;
}

export interface UpdateProfileRequest {
  email?: string;
  username?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const getProfile = async (): Promise<UserProfile> => {
  const response = await axiosInstance.get<UserProfile>("/api/user/profile");
  return response.data;
};

export const updateProfile = async (
  data: UpdateProfileRequest,
): Promise<UserProfile> => {
  const response = await axiosInstance.patch<UserProfile>(
    "/api/user/profile",
    data,
  );
  return response.data;
};

export const updatePassword = async (
  data: UpdatePasswordRequest,
): Promise<void> => {
  await axiosInstance.patch("/api/user/password", data);
};
