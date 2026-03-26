"use client";

import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  Book,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Video,
  ExternalLink,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do I create a new issue?",
    answer:
      "To create a new issue, click on 'Add New' in the sidebar navigation. Fill in the required fields including title, description, project, priority, and assignee. Then click 'Create Issue' to submit.",
  },
  {
    question: "How do I assign an issue to someone?",
    answer:
      "When creating or editing an issue, use the 'Assignee' dropdown to select a team member. You can also reassign issues by clicking on the issue and updating the assignee field.",
  },
  {
    question: "What do the priority levels mean?",
    answer:
      "Priority levels help categorize urgency: Critical - requires immediate attention, High - should be addressed soon, Medium - normal priority, Low - can be addressed when time permits.",
  },
  {
    question: "How do I star an issue or project?",
    answer:
      "Click the star icon on any issue or project card to add it to your starred items. Starred items appear in your 'Starred' section for quick access.",
  },
  {
    question: "Can I filter issues by status or priority?",
    answer:
      "Yes! On the Projects page, you can use the filter options to view issues by status (Todo, In Progress, Review, Done) or by priority level.",
  },
  {
    question: "How do I change my notification settings?",
    answer:
      "Go to Settings > Notifications to customize which notifications you receive. You can toggle email notifications, push notifications, and activity alerts.",
  },
  {
    question: "How do I view all issues assigned to me?",
    answer:
      "Your assigned issues are displayed on the Dashboard in the 'Assigned to You' panel. You can also filter the Issues view by your name.",
  },
  {
    question: "What is the difference between Review and Done status?",
    answer:
      "Review status means the issue is completed but awaiting verification or approval. Done status means the issue has been fully resolved and verified.",
  },
];

const resources = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using the Issue Tracker",
    icon: Book,
    type: "Documentation",
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step video guides",
    icon: Video,
    type: "Video",
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers",
    icon: FileText,
    type: "Documentation",
  },
  {
    title: "Best Practices",
    description: "Tips for effective issue management",
    icon: CheckCircle2,
    type: "Guide",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground">
            How can we help you?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Search our knowledge base or browse frequently asked questions
          </p>
        </div>

        {/* Search */}
        <div className="mx-auto w-full max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for help..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((resource) => (
            <Card
              key={resource.title}
              className="cursor-pointer transition-colors hover:bg-accent/50"
            >
              <CardContent className="flex items-start gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <resource.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium">{resource.title}</h3>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {resource.description}
                  </p>
                  <Badge variant="secondary" className="mt-2 text-xs">
                    {resource.type}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to common questions about the Issue Tracker
                </CardDescription>
              </CardHeader>
              <CardContent>
                {filteredFaqs.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left text-sm">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No results found for your search.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Live Chat</p>
                    <p className="text-xs text-muted-foreground">
                      Available 9 AM - 6 PM EAT
                    </p>
                  </div>
                  <Button size="sm">Chat</Button>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Email Support</p>
                    <p className="text-xs text-muted-foreground">
                      support@ethiotelecom.et
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Phone Support</p>
                    <p className="text-xs text-muted-foreground">
                      +251 11 551 0000
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Support Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium">9:00 AM - 1:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium">Closed</span>
                </div>
                <p className="pt-2 text-xs text-muted-foreground">
                  All times are in East Africa Time (EAT)
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
