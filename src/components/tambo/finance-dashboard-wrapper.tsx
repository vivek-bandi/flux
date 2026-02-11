"use client";

import { FinanceDashboard } from "./finance-dashboard";

export function createFinanceDashboardComponent(userId: string) {
  return function FinanceDashboardWithUserId(props: any) {
    return <FinanceDashboard userId={userId} {...props} />;
  };
}
