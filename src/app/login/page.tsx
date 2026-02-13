import { LoginForm } from "@/components/auth/login-form";
import { AnimatedBackground } from "@/components/animated-background";
import { Sparkles } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <>
      <AnimatedBackground />
      <div className="relative flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-2/5 flex-col justify-between p-12 relative">
          <div className="relative z-10">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 mb-20">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Flux
              </span>
            </Link>

            {/* Main Content */}
            <div className="space-y-6">
              <h1 className="text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                Your AI financial assistant
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Manage expenses, track budgets, and gain insights through natural conversation.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Flux. All rights reserved.
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gray-50 dark:bg-gray-950">
          <div className="w-full max-w-md space-y-6 sm:space-y-8">
            {/* Mobile logo */}
            <div className="lg:hidden flex justify-center mb-6 sm:mb-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Flux</span>
              </Link>
            </div>

            {/* Header */}
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                Sign in to your account
              </h2>
            </div>

            {/* Glassmorphic card */}
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-violet-600 rounded-xl opacity-10 group-hover:opacity-20 blur transition duration-300" />
              
              {/* Main card */}
              <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                <LoginForm />
              </div>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              New to Flux?{" "}
              <Link
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
