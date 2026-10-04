import { NextResponse } from "next/server";
import { contributionDays } from "@/config/portfolio-data";
import { fetchLiveGitHubStats } from "@/lib/github-live";

/** Re-fetched from GitHub at most once an hour; every visitor gets the cached copy. */
export const revalidate = 3600;

export async function GET() {
  const stats = await fetchLiveGitHubStats(contributionDays);
  return NextResponse.json(stats);
}
