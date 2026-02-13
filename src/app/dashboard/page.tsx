"use client";

import { ScrollableMessageContainer } from "@/components/tambo/scrollable-message-container";
import {
  ThreadContent,
  ThreadContentMessages,
} from "@/components/tambo/thread-content";
import { UserAvatar } from "@/components/tambo/user-avatar";
import { ErrorBoundary } from "@/components/error-boundary";
import { useAuth } from "@/contexts/auth-context";
import { createComponents } from "@/lib/tambo/tambo";
import { TamboProvider, useTambo, useTamboThreadInput } from "@tambo-ai/react";
import { LogOut, MessageSquare, Sparkles } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// MessageInput uses useTamboVoice which requires Web Worker API (not available during SSR)
const MessageInput = dynamic(
  () =>
    import("@/components/tambo/message-input").then((mod) => ({
      default: mod.MessageInput,
    })),
  { ssr: false },
);

function DashboardContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { thread } = useTambo();
  const { setValue, submit } = useTamboThreadInput();

  const hasMessages = (thread?.messages?.length ?? 0) > 0;
  const messageCount = thread?.messages?.length ?? 0;

  const suggestedPrompts = [
    "Show my finance dashboard",
    "I spent ₹500 on groceries",
    "What tools do you have?",
    "Set a ₹5000 budget for groceries",
  ];

  const handlePromptClick = async (prompt: string) => {
    setValue(prompt);
    setTimeout(() => {
      submit({ streamResponse: true });
    }, 0);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to sign out";
      console.error("Sign out error:", message);
      // Still redirect even if there's an error
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-linear-to-br from-background via-background to-primary/5 overflow-hidden" style={{ height: '100dvh' }}>
      {/* App Bar */}
      <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm shrink-0 z-20">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: App Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-linear-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-base sm:text-lg font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Flux
            </h1>
          </div>

          {/* Right: User + Actions (Sign Out only on mobile, avatar+signout on sm+) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-3 min-w-0 max-w-full">
            <div className="hidden sm:block">
              <UserAvatar user={user} />
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm hover:shadow w-full sm:w-auto">
              <LogOut className="h-3.5 w-3.5" />
              <span className="inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace: Two-Panel Layout */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Left Panel: Context & Activity - Desktop Only */}
        <aside className="hidden lg:flex lg:w-80 flex-col gap-4 p-4 border-r border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 overflow-y-auto shrink-0">
          {/* Workspace Info Card */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm p-5 space-y-3 shrink-0">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Sparkles className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Workspace
              </h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-medium text-gray-900 dark:text-white">
                  {user?.user_metadata?.name || "User"}
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 hidden sm:block">
                {user?.email}
              </p>
            </div>
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Active</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" />
                <span>{messageCount} messages</span>
              </div>
            </div>
          </div>

          {/* Suggested Prompts Card */}
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm p-5 space-y-3 flex-1 overflow-hidden">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Sparkles className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wide">
                Suggested Prompts
              </h2>
            </div>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="w-full text-left p-3 rounded-lg bg-linear-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-cyan-100 dark:hover:from-blue-900/40 dark:hover:to-cyan-900/40 hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300" />
                    <p className="text-xs font-medium text-blue-900 dark:text-blue-100 group-hover:text-blue-950 dark:group-hover:text-white">
                      {prompt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Panel: AI Chat */}
        <main className="flex-1 flex flex-col rounded-none lg:rounded-xl border-none lg:border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-none lg:shadow-lg overflow-hidden min-h-0">
          {/* Chat Header */}
          <div className="border-b border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">AI Chat</h2>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span>Powered by Tambo</span>
            </div>
          </div>

          {/* Messages Area */}
          <ScrollableMessageContainer className="flex-1 p-4 sm:p-6 min-h-0">
            <ErrorBoundary>
              {!hasMessages ? (
              <div className="flex flex-col items-center justify-center text-center space-y-6 min-h-full animate-in fade-in duration-700">
                <div className="w-16 h-16 bg-linear-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Ready to assist
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md">
                    Ask me anything or use voice input to get started. I can
                    help with your tasks, answer questions, and more.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ThreadContent>
                  <ThreadContentMessages />
                </ThreadContent>
              </div>
            )}
            </ErrorBoundary>
          </ScrollableMessageContainer>

          {/* Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 p-3 sm:p-4 shrink-0 safe-bottom">
            <MessageInput />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  const components =
    user?.id && user?.email
      ? createComponents(
          user.id,
          user.email,
          user.user_metadata?.name as string | undefined,
        )
      : [];

  if (!process.env.NEXT_PUBLIC_TAMBO_API_KEY) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-red-50 to-red-100">
        <div className="text-center space-y-4 p-8 bg-white rounded-lg shadow-lg border border-red-200">
          <div className="text-5xl">⚠️</div>
          <h2 className="text-xl font-semibold text-red-900">
            Configuration Error
          </h2>
          <p className="text-red-700 max-w-md">
            Missing{" "}
            <code className="px-2 py-1 bg-red-100 rounded">
              NEXT_PUBLIC_TAMBO_API_KEY
            </code>
          </p>
          <p className="text-sm text-red-600">
            Please add your Tambo API key to <code>.env.local</code>
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-background via-background to-primary/5">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user && !isLoading) {
    return null;
  }

  return (
    <TamboProvider
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY}
      components={components}
    >
      <DashboardContent />
    </TamboProvider>
  );
}
