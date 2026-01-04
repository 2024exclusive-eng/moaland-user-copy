import api from "@/lib/axios";

export interface Profile {
  name: string | null;
  description: string | null;
  layout: string;
  profileImg: string | null;
  profileBackgroundImage: string | null;
  backgroundType: string;
  backgroundImg: string | null;
  backgroundColor: string | null;
  effect: string | null;
  isButton: string;
  buttonText: string | null;
  buttonUrl: string | null;
  blockBackgroundColor: string | null;
  blockTextFont: string | null;
  blockLayout: string;
}

export interface MyInfo {
  id: number;
  email: string;
  link: string | null;
  oauthType: string | null;
  account: string | null;
  depositor: string | null;
}

export interface ProfileResponse {
  success: boolean;
  profile: Profile;
  block: unknown[];
  my: MyInfo;
}

export async function getProfile(): Promise<ProfileResponse> {
  const response = await api.get<ProfileResponse>("/user/profile");
  return response.data;
}

export interface UploadImageResponse {
  success: boolean;
  data: { uri: string };
}

export async function uploadProfileImage(
  file: File
): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post<UploadImageResponse>(
    "/user/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export interface UpdateProfileRequest {
  email?: string;
  profileImg: string | null;
}

export interface UpdateProfileResponse {
  success: boolean;
}

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const response = await api.put<UpdateProfileResponse>("/user/profile", data);
  return response.data;
}
