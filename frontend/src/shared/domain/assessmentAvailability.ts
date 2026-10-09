import { AssessmentStatus, type AssessmentSummaryDto } from "shared/api/types";

export const ASSESSMENT_AVAILABILITY_DAYS = 7;

export function resolveDueDate(assessment: AssessmentSummaryDto) {
  if (assessment.dueAtUtc) {
    return assessment.dueAtUtc;
  }

  const baseDate = assessment.assignedAtUtc ?? assessment.createdAtUtc;
  const date = new Date(baseDate);
  date.setDate(date.getDate() + ASSESSMENT_AVAILABILITY_DAYS);
  return date.toISOString();
}

export function isAssessmentExpired(assessment: AssessmentSummaryDto, now = Date.now()) {
  return (
    assessment.status === AssessmentStatus.Draft &&
    !assessment.startedAtUtc &&
    new Date(resolveDueDate(assessment)).getTime() <= now
  );
}
