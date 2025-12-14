import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * API route for revalidating cache tags
 * This can be called from Payload hooks or webhooks
 *
 * Usage:
 * POST /api/revalidate
 * Body: { tags: string[] }
 *
 * Or with query params:
 * POST /api/revalidate?tag=projects&tag=news
 */
export async function POST(request: NextRequest) {
  try {
    // Check for authorization (optional but recommended)
    const authHeader = request.headers.get("authorization");
    const secret = process.env.REVALIDATE_SECRET;

    if (secret && authHeader !== `Bearer ${secret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get tags from body or query params
    let tags: string[] = [];

    try {
      const body = await request.json();
      if (Array.isArray(body.tags)) {
        tags = body.tags;
      } else if (typeof body.tag === "string") {
        tags = [body.tag];
      }
    } catch {
      // If body parsing fails, try query params
      const searchParams = request.nextUrl.searchParams;
      tags = searchParams.getAll("tag");
    }

    if (tags.length === 0) {
      return NextResponse.json(
        { error: "No tags provided" },
        { status: 400 }
      );
    }

    // Revalidate all provided tags
    tags.forEach((tag) => {
      revalidateTag(tag);
    });

    return NextResponse.json({
      revalidated: true,
      tags,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Error revalidating cache:", error);
    return NextResponse.json(
      { error: "Error revalidating cache" },
      { status: 500 }
    );
  }
}

// Also support GET for easier webhook testing
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tags = searchParams.getAll("tag");

  if (tags.length === 0) {
    return NextResponse.json(
      { error: "No tags provided. Use ?tag=projects&tag=news" },
      { status: 400 }
    );
  }

  // Check for authorization
  const authHeader = request.headers.get("authorization");
  const secret = process.env.REVALIDATE_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  tags.forEach((tag) => {
    revalidateTag(tag);
  });

  return NextResponse.json({
    revalidated: true,
    tags,
    now: Date.now(),
  });
}
