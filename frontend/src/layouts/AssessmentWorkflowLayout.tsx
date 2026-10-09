import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

export function AssessmentWorkflowLayout() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        p: { xs: 2, sm: 3 },
      }}
    >
      <Outlet />
    </Box>
  );
}
