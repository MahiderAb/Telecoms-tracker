"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Star,
  Edit,
  Trash2,
  Clock,
  User,
  FolderKanban,
  Calendar,
  MessageSquare,
  Send,
  Link as LinkIcon,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import type {
  Issue,
  Project,
  User as UserType,
  Status,
  Priority,
} from "@/lib/types";

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-chart-3/20 text-chart-3",
  high: "bg-chart-5/20 text-chart-5",
  critical: "bg-destructive/20 text-destructive",
};

const statusColors = {
  todo: "bg-muted text-muted-foreground",
  "in-progress": "bg-chart-2/20 text-chart-2",
  review: "bg-chart-4/20 text-chart-4",
  done: "bg-primary/20 text-primary",
};

const statusLabels = {
  todo: "Todo",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: string;
}

const mockComments: Comment[] = [
  {
    id: "comment-1",
    userId: "user-2",
    userName: "Sara Tesfaye",
    userAvatar: "/placeholder.svg",
    content:
      "I've started looking into this issue. The initial investigation shows it might be related to the recent network configuration changes.",
    timestamp: "2026-03-08T10:30:00Z",
  },
  {
    id: "comment-2",
    userId: "user-1",
    userName: "Abebe Kebede",
    userAvatar: "/placeholder.svg",
    content:
      "Thanks for the update. Let me know if you need any additional context or access to the network logs.",
    timestamp: "2026-03-08T11:15:00Z",
  },
];

export default function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [issue, setIssue] = useState<Issue | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [status, setStatus] = useState<Status>("todo");
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    async function fetchData() {
      try {
        const [issuesRes, projectsRes, usersRes] = await Promise.all([
          fetch("/api/issues"),
          fetch("/api/projects"),
          fetch("/api/users"),
        ]);

        if (issuesRes.ok) {
          const issuesData = await issuesRes.json();
          const foundIssue = issuesData.find((i: Issue) => i.id === id);
          if (foundIssue) {
            setIssue(foundIssue);
            setIsStarred(foundIssue.starred || false);
            setStatus(foundIssue.status);
            setPriority(foundIssue.priority);

            if (projectsRes.ok) {
              const projectsData = await projectsRes.json();
              const foundProject = projectsData.find(
                (p: Project) => p.id === foundIssue.projectId,
              );
              setProject(foundProject || null);
            }
          }
        }

        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData);
        }
      } catch (error) {
        console.error("Failed to fetch issue data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const getUserById = (userId: string) => users.find((u) => u.id === userId);

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `comment-${Date.now()}`,
      userId: "user-1",
      userName: "Abebe Kebede",
      userAvatar: "/placeholder.svg",
      content: newComment,
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, comment]);
    setNewComment("");
  };

  const assignee = issue ? getUserById(issue.assigneeId) : null;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex h-full items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (!issue) {
    return (
      <DashboardLayout>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Issue not found</p>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Link href={project ? `/projects/${project.id}` : "/"}>
              <Button variant="ghost" size="icon" className="mt-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline">{issue.id}</Badge>
                <Badge variant="outline" className={priorityColors[priority]}>
                  {priority}
                </Badge>
                <Badge variant="outline" className={statusColors[status]}>
                  {statusLabels[status]}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                {issue.title}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsStarred(!isStarred)}
            >
              <Star
                className={`h-4 w-4 ${
                  isStarred ? "fill-chart-3 text-chart-3" : ""
                }`}
              />
            </Button>
            <Button variant="outline" size="icon">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {issue.description}
                </p>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>
                        {comment.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {comment.userName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            },
                          )}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}

                <Separator className="my-4" />

                {/* Add Comment */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={3}
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                      >
                        <Send className="mr-2 h-4 w-4" />
                        Send
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Status
                  </label>
                  <Select
                    value={status}
                    onValueChange={(value: Status) => setStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Todo</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Priority
                  </label>
                  <Select
                    value={priority}
                    onValueChange={(value: Priority) => setPriority(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Assignee</p>
                      <div className="flex items-center gap-2 mt-1">
                        {assignee && (
                          <>
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={assignee.avatar} />
                              <AvatarFallback>
                                {assignee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{assignee.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Project</p>
                      {project && (
                        <Link
                          href={`/projects/${project.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          {project.name}
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p className="text-sm">
                        {new Date(issue.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">
                        Last Updated
                      </p>
                      <p className="text-sm">
                        {new Date(issue.updatedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
