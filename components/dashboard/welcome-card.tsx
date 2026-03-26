import { Sparkles } from "lucide-react";

interface WelcomeCardProps {
  userName: string;
}

export function WelcomeCard({ userName }: WelcomeCardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground shadow-lg lg:p-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="grid"
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium opacity-90">
              Welcome back!
            </span>
          </div>
          <h1 className="mb-2 text-2xl font-bold lg:text-3xl text-balance">
            Hello, {userName}
          </h1>
          <p className="max-w-xl text-sm opacity-90 lg:text-base text-pretty">
            Track and manage all your issues efficiently. Stay on top of your
            projects with Ethiotelecom Issue Tracker.
          </p>
        </div>

        {/* Decorative Element */}
        <div className="hidden lg:block">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 animate-pulse rounded-full bg-primary-foreground/20" />
            <div className="absolute inset-4 rounded-full bg-primary-foreground/30" />
            <div className="absolute inset-8 flex items-center justify-center rounded-full bg-primary-foreground">
              <span className="text-2xl font-bold text-primary">ET</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
