import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";

export interface AssessmentResumePointerDto {
  assessmentId: string;
  subModuleId: string;
  questionId?: string | null;
  touchedAtUtc: string;
}

export interface SaveAssessmentResumePointerRequest {
  assessmentId: string;
  subModuleId: string;
  questionId?: string | null;
  touchedAtUtc: string;
}

const resumePointerKey = (userId: string | null | undefined) =>
  ["assessment-progress", "resume-pointer", userId ?? "me"] as const;

async function getResumePointer() {
  const { data } = await axiosClient.get<AssessmentResumePointerDto | null>("/dashboard-governance/resume-pointer");
  return data;
}

async function saveResumePointer(request: SaveAssessmentResumePointerRequest) {
  const { data } = await axiosClient.put<AssessmentResumePointerDto | null>("/dashboard-governance/resume-pointer", request);
  return data;
}

async function clearResumePointer() {
  await axiosClient.delete("/dashboard-governance/resume-pointer");
}

export function useResumePointer(userId: string | null | undefined) {
  return useQuery({
    queryKey: resumePointerKey(userId),
    queryFn: getResumePointer,
    enabled: Boolean(userId),
    staleTime: 60_000,
  });
}

export function useSaveResumePointer(userId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveResumePointer,
    onSuccess: (data) => {
      queryClient.setQueryData(resumePointerKey(userId), data);
    },
  });
}

export function useClearResumePointer(userId: string | null | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearResumePointer,
    onSuccess: () => {
      queryClient.setQueryData(resumePointerKey(userId), null);
    },
  });
}
