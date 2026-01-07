import { NextResponse } from "next/server";

export async function GET() {
  try {
    const buildHookUrl = process.env.VERCEL_BUILD_HOOK_URL;

    if (!buildHookUrl) {
      return NextResponse.json(
        { error: "Build hook URL not configured" },
        { status: 500 }
      );
    }
    const response = await fetch(buildHookUrl, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`Build hook failed: ${response.status}`);
    }

    return NextResponse.json({
      success: true,
      message: "Build triggered successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Rebuild cron job failed:", error);
    return NextResponse.json(
      { error: "Failed to trigger rebuild" },
      { status: 500 }
    );
  }
}
