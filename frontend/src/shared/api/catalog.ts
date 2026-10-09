import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "./axiosClient";
import type { CategoryDto } from "./types";

const catalogTreeKey = (includeQuestions: boolean) =>
  ["assessment-catalog", "tree", includeQuestions] as const;

export function useHierarchy(_includeInactive = false, includeQuestions = false) {
  return useQuery({
    queryKey: catalogTreeKey(includeQuestions),
    queryFn: async () => {
      const { data } = await axiosClient.get<CategoryDto[]>("/assessment-catalog/tree", {
        params: { includeInactive: false, includeQuestions },
      });
      return data;
    },
  });
}
