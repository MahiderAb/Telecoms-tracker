"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import {
  PlusCircle,
  Bug,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import type {
  Project,
  User,
  Priority,
  Status,
  CreateIssuePayload,
} from "@/lib/types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const priorityOptions: { value: Priority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "bg-muted" },
  { value: "medium", label: "Medium", color: "bg-warning" },
  { value: "high", label: "High", color: "bg-chart-5" },
  { value: "critical", label: "Critical", color: "bg-destructive" },
];

const statusOptions: { value: Status; label: string }[] = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];
export default function NewIssuePage() {
  const { data: projects } = useSWR<Project[]>("/api/projects", fetcher);
  const { data: users } = useSWR<User[]>("/api/users", fetcher);

  const [formData, setFormData] = useState<CreateIssuePayload>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    projectId: "",
    assigneeId: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }
    if (
      !formData.projectId ||
      !projects?.find((p) => p.id === formData.projectId)
    ) {
      setError("Please select a valid project");
      return;
    }
    if (
      !formData.assigneeId ||
      !users?.find((u) => u.id === formData.assigneeId)
    ) {
      setError("Please select a valid assignee");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting formData:", formData);

      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const responseText = await res.text();
      console.log("Response status:", res.status);
      console.log("Response body:", responseText);

      if (!res.ok) {
        throw new Error(responseText || "Failed to create issue");
      }

      setIsSuccess(true);
      mutate("/api/issues");
      mutate("/api/dashboard/stats");

      setTimeout(() => {
        setFormData({
          title: "",
          description: "",
          priority: "medium",
          status: "todo",
          projectId: "",
          assigneeId: "",
        });
        setIsSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to create issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProject = projects?.find((p) => p.id === formData.projectId);
  const selectedUser = users?.find((u) => u.id === formData.assigneeId);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <PlusCircle className="h-6 w-6 text-primary" />
              Create New Issue
            </h1>
            <p className="text-muted-foreground">
              Report a bug, request a feature, or create a task
            </p>
          </div>
        </div>

        {isSuccess && (
          <Card className="border-primary bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-primary">
                    Issue Created Successfully!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your issue has been added to the tracker
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-semibold text-destructive">Error</p>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bug className="h-5 w-5" />
                Issue Details
              </CardTitle>
              <CardDescription>
                Fill in the details below to create a new issue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="text-base"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide more details about the issue..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>

              {/* Project & Assignee Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Project */}
                <div className="space-y-2">
                  <Label>
                    Project <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, projectId: value }))
                    }
                    disabled={!projects || projects.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects?.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedProject && (
                    <p className="text-xs text-muted-foreground">
                      Lead: {selectedProject.leadName}
                    </p>
                  )}
                </div>

                {/* Assignee */}
                <div className="space-y-2">
                  <Label>
                    Assignee <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.assigneeId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, assigneeId: value }))
                    }
                    disabled={!users || users.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Assign to someone" />
                    </SelectTrigger>
                    <SelectContent>
                      {users?.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedUser && (
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.role}
                    </p>
                  )}
                </div>
              </div>

              {/* Priority & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: Priority) =>
                      setFormData((prev) => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Status) =>
                      setFormData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Link href="/">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={isSubmitting || !projects || !users}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Create Issue
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
}
