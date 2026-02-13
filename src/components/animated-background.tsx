"use client";

/**
 * Stripe-inspired animated gradient background
 * Features moving gradient orbs with blur effects
 */
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-violet-50 to-purple-50 dark:from-gray-950 dark:via-indigo-950/20 dark:to-violet-950/20" />
      
      {/* Animated gradient orbs */}
      <div className="absolute -top-1/2 -left-1/2 w-full h-full">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
          style={{ animationDelay: '0s' }}
        />
      </div>
      
      <div className="absolute -top-1/2 -right-1/2 w-full h-full">
        <div 
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-violet-400/30 dark:bg-violet-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
          style={{ animationDelay: '2s' }}
        />
      </div>
      
      <div className="absolute -bottom-1/2 left-1/3 w-full h-full">
        <div 
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-400/30 dark:bg-purple-600/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-blob"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
      }} />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-size-[4rem_4rem] mask-[radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
    </div>
  );
}
