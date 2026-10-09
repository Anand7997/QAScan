import type { RouteObject } from "react-router-dom";
import { AuthGuard } from "app/routing/guards/AuthGuard";
import { AssessmentWorkflowLayout } from "layouts/AssessmentWorkflowLayout";
import { UserReportsPage } from "features/reports/pages/UserReportsPage";
import { MyAssessmentsPage } from "features/assignments/pages/MyAssessmentsPage";
import { QmriAgentAnalysisPage } from "features/agent-analysis/pages/QmriAgentAnalysisPage";
import { RoutePaths } from "shared/constants/routePaths";

export const privateRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        path: "portal",
        element: <AssessmentWorkflowLayout />,
        children: [
          { path: RoutePaths.portalAssessments, element: <MyAssessmentsPage /> },
          { path: RoutePaths.portalAgentAnalysis, element: <QmriAgentAnalysisPage /> },
          { path: RoutePaths.portalReports, element: <UserReportsPage /> },
        ],
      },
    ],
  },
];
