import { axiosClient } from "./axiosClient";
import type { AuthUser } from "shared/auth/authStorage";

export interface PublicAssessmentSessionResponse {
  accessToken: string;
  accessTokenExpiresAtUtc: string;
  refreshToken: {
    token: string;
    expiresAtUtc: string;
  };
  user: AuthUser;
  assessment: { assessmentId: string };
}

export async function createPublicAssessmentSession(): Promise<PublicAssessmentSessionResponse> {
  const { data } = await axiosClient.post<PublicAssessmentSessionResponse>("/auth/public-session");
  return data;
}
