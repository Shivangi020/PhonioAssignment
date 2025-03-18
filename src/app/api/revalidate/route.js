// app/api/revalidate/route.js
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

// Make sure both HTTP methods are implemented
export async function POST(request) {
  try {
    // Get the path from the request body
    const body = await request.json();
    const path = body.path || "/";

    // Revalidate the path
    revalidatePath(path);

    // Log the new server build time
    const serverBuildTime = new Date().toISOString();
    console.log(`[Server] Page revalidated at: ${serverBuildTime}`);

    // Return the build time in the response
    return NextResponse.json({
      revalidated: true,
      serverBuildTime,
      message: `Page ${path} revalidated successfully`,
    });
  } catch (error) {
    console.error("[Server] Error during revalidation:", error);
    return NextResponse.json(
      {
        revalidated: false,
        message: "Error revalidating",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// Adding GET method for testing
export async function GET() {
  return NextResponse.json({
    message: "Revalidation API is working. Use POST to trigger revalidation.",
  });
}
