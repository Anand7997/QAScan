export const RoutePaths = {
  root: "/",
  publicAssessment: "/assessment",
  portalAssessments: "/portal/my-assessments",
  portalAgentAnalysis: "/portal/assessments/:assessmentId/agent-analysis",
  portalReports: "/portal/reports",
} as const;

export const portalAgentAnalysisPath = (assessmentId: string) =>
RoutePaths.portalAgentAnalysis.replace(":assessmentId", assessmentId);
