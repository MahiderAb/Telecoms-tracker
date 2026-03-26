import type { Issue, Project, User, Activity, DashboardStats } from "./types";

export const users: User[] = [
  {
    id: "user-1",
    name: "Abebe Kebede",
    email: "abebe.kebede@ethiotelecom.et",
    avatar: "AK",
    role: "Senior Developer",
  },
  {
    id: "user-2",
    name: "Sara Tesfaye",
    email: "sara.tesfaye@ethiotelecom.et",
    avatar: "ST",
    role: "Product Manager",
  },
  {
    id: "user-3",
    name: "Yonas Bekele",
    email: "yonas.bekele@ethiotelecom.et",
    avatar: "YB",
    role: "QA Engineer",
  },
  {
    id: "user-4",
    name: "Hana Girma",
    email: "hana.girma@ethiotelecom.et",
    avatar: "HG",
    role: "DevOps Engineer",
  },
  {
    id: "user-5",
    name: "Dawit Mulugeta",
    email: "dawit.mulugeta@ethiotelecom.et",
    avatar: "DM",
    role: "UI/UX Designer",
  },
];

export const projects: Project[] = [
  {
    id: "proj-1",
    name: "Network Infrastructure",
    tag: "NETINF",
    description: "Core network infrastructure and telecommunications systems",
    leadId: "user-1",
    leadName: "Abebe Kebede",
    color: "bg-primary",
    issueCount: 24,
    starred: true,
  },
  {
    id: "proj-2",
    name: "Customer Portal",
    tag: "CUSTPRT",
    description: "Self-service customer portal for account management",
    leadId: "user-2",
    leadName: "Sara Tesfaye",
    color: "bg-chart-2",
    issueCount: 18,
    starred: true,
  },
  {
    id: "proj-3",
    name: "Mobile App v3",
    tag: "MOBILEAPP",
    description: "Next generation mobile application for iOS and Android",
    leadId: "user-5",
    leadName: "Dawit Mulugeta",
    color: "bg-chart-3",
    issueCount: 32,
    starred: false,
  },
  {
    id: "proj-4",
    name: "Billing System",
    tag: "BILLING",
    description: "Automated billing and invoice generation system",
    leadId: "user-4",
    leadName: "Hana Girma",
    color: "bg-chart-4",
    issueCount: 15,
    starred: false,
  },
];

export const issues: Issue[] = [
  {
    id: "NETINF-001",
    title: "Network latency in Addis Ababa region",
    description: "Users reporting high latency in downtown areas",
    priority: "high",
    status: "in-progress",
    projectId: "proj-1",
    assigneeId: "user-1",
    createdAt: "2026-03-05T10:00:00Z",
    updatedAt: "2026-03-08T14:30:00Z",
    starred: true,
  },
  {
    id: "CUSTPRT-042",
    title: "Payment gateway integration",
    description: "Integrate telebirr payment option",
    priority: "critical",
    status: "review",
    projectId: "proj-2",
    assigneeId: "user-2",
    createdAt: "2026-03-01T09:00:00Z",
    updatedAt: "2026-03-09T08:00:00Z",
    starred: true,
  },
  {
    id: "MOBILEAPP-128",
    title: "Push notification not working on iOS",
    description: "iOS users not receiving push notifications",
    priority: "high",
    status: "todo",
    projectId: "proj-3",
    assigneeId: "user-1",
    createdAt: "2026-03-07T11:00:00Z",
    updatedAt: "2026-03-07T11:00:00Z",
    starred: false,
  },
  {
    id: "BILLING-055",
    title: "Invoice generation delay",
    description: "Monthly invoices taking too long to generate",
    priority: "medium",
    status: "in-progress",
    projectId: "proj-4",
    assigneeId: "user-4",
    createdAt: "2026-03-02T08:00:00Z",
    updatedAt: "2026-03-08T16:00:00Z",
    starred: false,
  },
  {
    id: "NETINF-002",
    title: "5G rollout tracking",
    description: "Track 5G deployment progress",
    priority: "low",
    status: "todo",
    projectId: "proj-1",
    assigneeId: "user-1",
    createdAt: "2026-03-06T10:00:00Z",
    updatedAt: "2026-03-06T10:00:00Z",
    starred: false,
  },
  {
    id: "CUSTPRT-043",
    title: "User dashboard redesign",
    description: "Update dashboard UI to new design system",
    priority: "medium",
    status: "done",
    projectId: "proj-2",
    assigneeId: "user-5",
    createdAt: "2026-02-25T09:00:00Z",
    updatedAt: "2026-03-08T17:00:00Z",
    starred: false,
  },
];

export const activities: Activity[] = [
  {
    id: "act-1",
    userId: "user-1",
    userName: "Abebe Kebede",
    userAvatar: "AK",
    action: "updated issue status to In Progress",
    issueId: "NETINF-001",
    issueTitle: "Network latency in Addis Ababa region",
    timestamp: "2026-03-09T08:30:00Z",
  },
  {
    id: "act-2",
    userId: "user-2",
    userName: "Sara Tesfaye",
    userAvatar: "ST",
    action: "moved issue to Review",
    issueId: "CUSTPRT-042",
    issueTitle: "Payment gateway integration",
    timestamp: "2026-03-09T08:00:00Z",
  },
  {
    id: "act-3",
    userId: "user-3",
    userName: "Yonas Bekele",
    userAvatar: "YB",
    action: "commented on issue",
    issueId: "MOBILEAPP-128",
    issueTitle: "Push notification not working on iOS",
    timestamp: "2026-03-08T16:45:00Z",
  },
  {
    id: "act-4",
    userId: "user-5",
    userName: "Dawit Mulugeta",
    userAvatar: "DM",
    action: "completed issue",
    issueId: "CUSTPRT-043",
    issueTitle: "User dashboard redesign",
    timestamp: "2026-03-08T17:00:00Z",
  },
  {
    id: "act-5",
    userId: "user-4",
    userName: "Hana Girma",
    userAvatar: "HG",
    action: "created new issue",
    issueId: "BILLING-055",
    issueTitle: "Invoice generation delay",
    timestamp: "2026-03-08T14:20:00Z",
  },
];

export const dashboardStats: DashboardStats = {
  todo: 12,
  inProgress: 8,
  review: 5,
  done: 45,
};

export function getIssuesByAssignee(assigneeId: string): Issue[] {
  return issues.filter((issue) => issue.assigneeId === assigneeId);
}

export function getIssuesByProject(projectId: string): Issue[] {
  return issues.filter((issue) => issue.projectId === projectId);
}

export function getIssuesByStatus(status: Issue["status"]): Issue[] {
  return issues.filter((issue) => issue.status === status);
}

export function getUserById(userId: string): User | undefined {
  return users.find((user) => user.id === userId);
}

export function getProjectById(projectId: string): Project | undefined {
  return projects.find((project) => project.id === projectId);
}
