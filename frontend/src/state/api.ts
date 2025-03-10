import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  teamId?: number;
}

export enum Priority {
  Urgent = "Urgent",
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Backlog = "Backlog",
}

export enum Status {
  ToDo = "To Do",
  WorkInProgress = "Work In Progress",
  UnderReview = "Under Review",
  Completed = "Completed",
}

export interface User {
  userId?: number;
  username: string;
  email: string;
  image?: string;
  teamId?: number;
  password?: string;
  role?: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  tags?: string;
  startDate?: string;
  dueDate?: string;
  points?: number;
  projectId: number;
  authorUserId?: number;
  assignedUserId?: number;

  author?: User;
  assignee?: User;
  comments?: Comment[];
  image: string;
}

export interface SearchResults {
  tasks?: Task[];
  projects?: Project[];
  users?: User[];
}

export interface Team {
  teamId: number;
  teamName: string;
  productOwnerUserId?: number;
  projectManagerUserId?: number;
}
export interface Comment {
  id: number;
  text: string;
  taskId?: number;
  userId?: number;
  userName?: string;
  image?: string;
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Projects", "Tasks", "Users", "Profile", "Teams"],
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => "projects",
      providesTags: ["Projects"],
    }),

    createProject: build.mutation<Project, Partial<Project>>({
      query: (newProject) => ({
        url: "projects",
        method: "POST",
        body: newProject,
      }),
      invalidatesTags: ["Projects"],
    }),
    getTasks: build.query<Task[], { projectId: number }>({
      query: ({ projectId }) => `tasks?projectId=${projectId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const },
            ]
          : [{ type: "Tasks" as const }],
    }),
    createTask: build.mutation<Task, Partial<Task>>({
      query: (newTask) => ({
        url: "tasks",
        method: "POST",
        body: newTask,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: build.mutation<Task, { taskId: number; status: string }>({
      query: ({ taskId, status }) => ({
        url: `tasks/${taskId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_, __, { taskId }) => [{ type: "Tasks", id: taskId }],
    }),
    deleteTask: build.mutation<void, { taskId: number }>({
      query: ({ taskId }) => ({
        url: `tasks?id=${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, { taskId }) => [{ type: "Tasks", id: taskId }],
    }),
    searchResults: build.query<SearchResults, string>({
      query: (query) => `search?query=${query}`,
    }),
    searchProject: build.query<Project, string>({
      query: (query) => `projects/search?query=${query}`,
    }),
    searchTasksResults: build.query<
      Task[],
      { projectId: number; query: string }
    >({
      query: ({ projectId, query }) =>
        `tasks/search?projectId=${projectId}&query=${query}`,
      providesTags: (result) => {
        return result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const },
            ]
          : [{ type: "Tasks" as const }];
      },
    }),
    getUsers: build.query<User[], void>({
      query: () => "users",
      providesTags: ["Users"],
    }),
    getProfile: build.query<User, void>({
      query: () => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        return {
          url: `user/profile/${id}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["Profile"],
    }),
    getTeams: build.query<Team[], void>({
      query: () => "teams",
      providesTags: ["Teams"],
    }),
    createTeam: build.mutation<Team, Partial<Team>>({
      query: (newTeam) => ({
        url: "teams",
        method: "POST",
        body: newTeam,
      }),
      invalidatesTags: ["Teams"],
    }),
    getTasksByUser: build.query<Task[], number>({
      query: (userId) => `tasks/user/${userId}`,
      providesTags: (result, _, userId) =>
        result
          ? result.map(({ id }) => ({ type: "Tasks", id }))
          : [{ type: "Tasks", id: userId }],
    }),
    getTasksByPriority: build.query<
      Task[],
      { projectId: number; priority: string }
    >({
      query: ({ projectId, priority }) =>
        `tasks/priority?projectId=${projectId}&priority=${priority}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Tasks" as const, id })),
              { type: "Tasks" as const },
            ]
          : [{ type: "Tasks" as const }],
    }),

    postComment: build.mutation<Comment, Partial<Comment>>({
      query: (newComment) => ({
        url: `tasks/${newComment.taskId}/comments`,
        method: "POST",
        body: newComment,
      }),
      invalidatesTags: ["Tasks"],
    }),
    createUser: build.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "user/register",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation<User, { data: Partial<User> }>({
      query: ({ data }) => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");
        return {
          url: `user/update/${id}`,
          method: "PATCH",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["Profile"],
    }),

    login: build.mutation<
      { token: string; id: number },
      { username: string; password: string }
    >({
      query: (credentials) => ({
        url: "user/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});
export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskStatusMutation,
  useSearchResultsQuery,
  useGetUsersQuery,
  useGetProfileQuery,
  useGetTeamsQuery,
  useCreateTeamMutation,
  useGetTasksByUserQuery,
  usePostCommentMutation,
  useCreateUserMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useGetTasksByPriorityQuery,
  useSearchTasksResultsQuery,
  useSearchProjectQuery,
  useDeleteTaskMutation,
} = api;
