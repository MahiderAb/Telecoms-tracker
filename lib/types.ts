export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "todo" | "in-progress" | "review" | "done";

export interface Issue {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: string;
  assigneeId: string;
  createdAt: string;
  updatedAt: string;
  starred?: boolean;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: string;
  assigneeId: string;
}

export interface Project {
  id: string;
  name: string;
  tag: string;
  description?: string;
  leadId: string;
  leadName: string;
  color: string;
  issueCount: number;
  starred?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface Activity {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  action: string;
  issueId?: string;
  issueTitle?: string;
  timestamp: string;
}

export interface DashboardStats {
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}
