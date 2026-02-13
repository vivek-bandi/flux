import { SignupForm } from "@/components/auth/signup-form";
import { AnimatedBackground } from "@/components/animated-background";
import { Sparkles, MessageSquare, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative flex min-h-screen">
        {/* Left Side - Features (Hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-12 relative">
          <div className="relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-16">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Flux
              </span>
            </Link>

            {/* Main Headline */}
            <div className="space-y-6 mb-12">
              <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Financial intelligence for modern teams
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Track expenses with AI, set smart budgets, and gain insights—all through natural conversation.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    AI-Powered Tracking
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Just say what you spent—we handle the rest
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Real-time Insights
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Instant analytics and budget alerts
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Bank-Grade Security
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Your data is encrypted and private
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} Flux. All rights reserved.
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full lg:w-1/2 xl:w-3/5 flex items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
            {/* Mobile Logo (Visible only on mobile) */}
            <div className="lg:hidden flex justify-center mb-6 sm:mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Flux
                </span>
              </Link>
            </div>

            <div className="text-center lg:text-left space-y-2">
              <h1 className="text-3xl sm:text-4xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Create your account
              </h1>
              <p className="text-base text-gray-600 dark:text-gray-400">
                Start tracking smarter today
              </p>
            </div>

            {/* Glassmorphic card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-violet-600 rounded-xl opacity-20 group-hover:opacity-30 blur transition duration-300" />
              
              {/* Main card */}
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-800/50 p-6 sm:p-8">
                <SignupForm />
              </div>
            </div>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
