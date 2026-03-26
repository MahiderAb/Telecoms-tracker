import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import {
  issues,
  projects,
  users,
  activities,
  dashboardStats,
  getIssuesByAssignee,
  getIssuesByProject,
  getIssuesByStatus,
  getUserById,
  getProjectById,
} from "@/lib/data";
import type { Issue, Priority, Status } from "@/lib/types";

const app = new Hono().basePath("/api");

// Enable CORS
app.use("/*", cors());

// Health check
app.get("/health", (c) => {
  return c.json({ status: "ok", message: "Ethiotelecom Issue Tracker API" });
});

// Dashboard stats
app.get("/dashboard/stats", (c) => {
  return c.json(dashboardStats);
});

// Issues routes
app.get("/issues", (c) => {
  const status = c.req.query("status") as Status | undefined;
  const assigneeId = c.req.query("assigneeId");
  const projectId = c.req.query("projectId");
  const priority = c.req.query("priority") as Priority | undefined;

  let filteredIssues = [...issues];

  if (status) {
    filteredIssues = filteredIssues.filter((issue) => issue.status === status);
  }

  if (assigneeId) {
    filteredIssues = filteredIssues.filter(
      (issue) => issue.assigneeId === assigneeId
    );
  }

  if (projectId) {
    filteredIssues = filteredIssues.filter(
      (issue) => issue.projectId === projectId
    );
  }

  if (priority) {
    filteredIssues = filteredIssues.filter(
      (issue) => issue.priority === priority
    );
  }

  return c.json(filteredIssues);
});

app.get("/issues/:id", (c) => {
  const id = c.req.param("id");
  const issue = issues.find((i) => i.id === id);

  if (!issue) {
    return c.json({ error: "Issue not found" }, 404);
  }

  return c.json(issue);
});

app.post("/issues", async (c) => {
  const body = await c.req.json<Omit<Issue, "id" | "createdAt" | "updatedAt">>();

  const newIssue: Issue = {
    ...body,
    id: `ISSUE-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  issues.push(newIssue);

  return c.json(newIssue, 201);
});

app.patch("/issues/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<Partial<Issue>>();

  const issueIndex = issues.findIndex((i) => i.id === id);

  if (issueIndex === -1) {
    return c.json({ error: "Issue not found" }, 404);
  }

  issues[issueIndex] = {
    ...issues[issueIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return c.json(issues[issueIndex]);
});

app.delete("/issues/:id", (c) => {
  const id = c.req.param("id");
  const issueIndex = issues.findIndex((i) => i.id === id);

  if (issueIndex === -1) {
    return c.json({ error: "Issue not found" }, 404);
  }

  issues.splice(issueIndex, 1);

  return c.json({ success: true });
});

// Issues by assignee
app.get("/issues/assignee/:assigneeId", (c) => {
  const assigneeId = c.req.param("assigneeId");
  const assigneeIssues = getIssuesByAssignee(assigneeId);
  return c.json(assigneeIssues);
});

// Issues by project
app.get("/issues/project/:projectId", (c) => {
  const projectId = c.req.param("projectId");
  const projectIssues = getIssuesByProject(projectId);
  return c.json(projectIssues);
});

// Issues by status
app.get("/issues/status/:status", (c) => {
  const status = c.req.param("status") as Status;
  const statusIssues = getIssuesByStatus(status);
  return c.json(statusIssues);
});

// Projects routes
app.get("/projects", (c) => {
  return c.json(projects);
});

app.get("/projects/:id", (c) => {
  const id = c.req.param("id");
  const project = getProjectById(id);

  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json(project);
});

// Users routes
app.get("/users", (c) => {
  return c.json(users);
});

app.get("/users/:id", (c) => {
  const id = c.req.param("id");
  const user = getUserById(id);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

app.get("/users/current", (c) => {
  // Return the first user as the current user for demo purposes
  return c.json(users[0]);
});

// Starred routes
app.get("/starred", (c) => {
  const starredProjects = projects.filter((p) => p.starred);
  const starredIssues = issues.filter((i) => i.starred);
  return c.json({ projects: starredProjects, issues: starredIssues });
});

app.get("/starred/projects", (c) => {
  const starredProjects = projects.filter((p) => p.starred);
  return c.json(starredProjects);
});

app.get("/starred/issues", (c) => {
  const starredIssues = issues.filter((i) => i.starred);
  return c.json(starredIssues);
});

// Activities routes
app.get("/activities", (c) => {
  const limit = c.req.query("limit");
  let result = [...activities];

  if (limit) {
    result = result.slice(0, parseInt(limit, 10));
  }

  return c.json(result);
});

app.get("/activities/recent", (c) => {
  // Return the 5 most recent activities
  return c.json(activities.slice(0, 5));
});

// Export handlers for Vercel
export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
