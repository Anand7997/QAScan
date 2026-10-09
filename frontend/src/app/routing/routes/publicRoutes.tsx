import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { PublicAssessmentPage } from "features/assessments/pages/PublicAssessmentPage";
import { RoutePaths } from "shared/constants/routePaths";

export const publicRoutes: RouteObject[] = [
  {
    path: RoutePaths.root,
    element: <PublicAssessmentPage />,
  },
  {
    path: RoutePaths.publicAssessment,
    element: <PublicAssessmentPage />,
  },
  {
    path: "*",
    element: <Navigate to={RoutePaths.root} replace />,
  },
];
