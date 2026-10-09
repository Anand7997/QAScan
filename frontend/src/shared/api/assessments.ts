import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import type {
  AssessmentDetailDto,
  AssessmentResponseDto,
  AssessmentSummaryDto,
  QmriAgentAnalysisDto,
  SubmitAssessmentRequest,
  UpsertAssessmentResponseRequest,
} from "./types";

const keys = {
  list: (userId?: string) => ["assessments", "list", userId ?? "me"] as const,
  detail: (id: string) => ["assessments", "detail", id] as const,
  agentAnalysis: (id: string) => ["assessments", "agent-analysis", "testscan-v1", id] as const,
};

export function useAssessments(userId?: string, enabled = true) {
  return useQuery({
    queryKey: keys.list(userId),
    queryFn: async () => {
      const { data } = await axiosClient.get<AssessmentSummaryDto[]>("/assessments", {
        params: userId ? { userId } : undefined,
      });
      return data;
    },
    enabled,
  });
}

export function useAssessment(assessmentId: string | undefined) {
  return useQuery({
    queryKey: keys.detail(assessmentId ?? ""),
    queryFn: async () => {
      const { data } = await axiosClient.get<AssessmentDetailDto>(`/assessments/${assessmentId}`);
      return data;
    },
    enabled: Boolean(assessmentId),
  });
}

export function useQmriAgentAnalysis(assessmentId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: keys.agentAnalysis(assessmentId ?? ""),
    queryFn: async () => {
      const { data } = await axiosClient.post<QmriAgentAnalysisDto>(
        `/assessments/${assessmentId}/agent-analysis`,
      );
      return data;
    },
    enabled: Boolean(assessmentId) && enabled,
    retry: false,
    staleTime: 30 * 60 * 1000,
  });
}

export function useSaveResponse(assessmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpsertAssessmentResponseRequest) =>
      axiosClient
        .put<AssessmentResponseDto>(`/assessments/${assessmentId}/responses`, body)
        .then((response) => response.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keys.detail(assessmentId) }),
  });
}

export function useStartAssessment(assessmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () =>
      axiosClient.post<AssessmentSummaryDto>(`/assessments/${assessmentId}/start`).then((response) => response.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: keys.detail(assessmentId) });
    },
  });
}

export function useSubmitAssessment(assessmentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body?: SubmitAssessmentRequest) =>
      axiosClient.post<AssessmentDetailDto>(`/assessments/${assessmentId}/submit`, body).then((response) => response.data),
    onSuccess: (detail) => {
      queryClient.setQueryData(keys.detail(assessmentId), detail);
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: keys.detail(assessmentId) });
    },
  });
}
