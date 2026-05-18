// studyPlan.api.ts — full replacement

import { baseAPI } from "@/store/api/baseApi";

const studyPlanAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    createStudyPlan: build.mutation({
      query: (data) => ({
        url: "/ai_part/create-study-plan",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["StudyPlan"],
    }),

    getStudyPlan: build.query({
      query: (params) => ({
        url: "/study_planner/all",
        method: "GET",
        params,
      }),
      providesTags: ["StudyPlan"],
    }),

    // ─── Fixed URL (was /study_planner/${id}, route didn't exist) ─────────
    getSingleStudyPlan: build.query({
      query: (id: string) => ({
        url: `/study_planner/${id}`,
        method: "GET",
      }),
      providesTags: ["StudyPlan"],
    }),

    saveStudyPlanProgress: build.mutation({
      query: (data) => ({
        url: "/study_planner/save-progress",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["StudyPlan"],
    }),

    saveMcqAttempts: build.mutation({
      query: (data: {
        planId: string;
        day: number;
        suggest_content: string;
        total_count: number;
        attempts: {
          questionId: string;
          selectedOption: string;
          isCorrect: boolean;
        }[];
      }) => ({
        url: "/study_planner/save-mcq-attempts",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["StudyPlan"],
    }),

    saveClinicalCaseAttempt: build.mutation({
      query: (data: {
        planId: string;
        day: number;
        suggest_content: string;
        caseId: string;
      }) => ({
        url: "/study_planner/save-clinical-attempt",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["StudyPlan"],
    }),

    cancelStudyPlan: build.mutation({
      query: (id: string) => ({
        url: `/study_planner/cancel/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["StudyPlan"],
    }),

    deleteStudyPlan: build.mutation({
      query: (id: string) => ({
        url: `/study_planner/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["StudyPlan"],
    }),

    updateStudyPlan: build.mutation({
      query: ({
        planId,
        ...body
      }: {
        planId: string;
        title?: string;
        exam_name: string;
        exam_date: string;
        exam_type: string;
        daily_study_time: number;
        start_date?: string;
        topics: unknown[];
        selection_snapshot?: unknown;
        created_from?: "smart_study" | "smart_study_planner";
      }) => ({
        url: `/study_planner/update/${planId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["StudyPlan"],
    }),
  }),
});

export const {
  useCreateStudyPlanMutation,
  useGetStudyPlanQuery,
  useGetSingleStudyPlanQuery,
  useSaveStudyPlanProgressMutation,
  useSaveMcqAttemptsMutation,
  useSaveClinicalCaseAttemptMutation,
  useCancelStudyPlanMutation,
  useDeleteStudyPlanMutation,
  useUpdateStudyPlanMutation,
} = studyPlanAPI;
