import Link from "next/link";
import { Sparkles, Wallet, MessageSquare, TrendingUp, Shield, Zap, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Flux
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg">
                Sign Up
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Content */}
      <main className="container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800">
              <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                AI-Powered Finance Tracking
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
              Talk to Your Finances,
              <br />
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Track Expenses Naturally
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto px-4">
              Say goodbye to manual expense tracking. Just tell Flux what you spent, 
              and our AI handles the rest—with real-time budgets and smart insights.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
            <Link href="/signup">
              <button className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg font-medium text-white bg-linear-to-r from-indigo-600 to-violet-600 rounded-lg hover:from-indigo-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/login">
              <button className="w-full sm:w-auto px-8 py-3 text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-md hover:shadow-lg">
                Login to Your Account
              </button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 sm:mt-32 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <MessageSquare className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Natural Language Interface
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Record expenses by simply talking or typing naturally. No forms, no hassle—just conversation.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Real-Time Budget Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Set category budgets and get instant visual feedback. Know exactly where you stand at all times.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Smart Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Understand spending patterns with AI-generated insights and beautiful visualizations.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              AI-Powered Tools
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Leverage generative UI that adapts to your needs. Get dynamic dashboards based on your queries.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bank-grade security with row-level access. Your financial data stays yours, always.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 sm:p-8 space-y-4 hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
              <Zap className="h-6 w-6 text-violet-600 dark:text-violet-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Lightning Fast
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Built on Next.js 16 with edge optimization. Experience instant responses and smooth interactions.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 sm:mt-32 bg-linear-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 sm:p-12 text-center text-white mx-4 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Finance Tracking?
          </h2>
          <p className="text-base sm:text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join users who are managing their money smarter with AI. 
            No credit card required—start tracking in seconds.
          </p>
          <Link href="/signup">
            <button className="px-8 py-3 text-base sm:text-lg font-medium text-indigo-700 bg-white rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl">
              Create Your Free Account
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-12 sm:mt-20 border-t border-gray-200 dark:border-gray-800">
        <div className="text-center text-gray-600 dark:text-gray-400">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Flux - AI Finance Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
