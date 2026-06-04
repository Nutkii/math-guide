import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cloudinary } from "@/lib/cloudinary";

async function requireAdmin() {
  const session = await auth();
  return (session?.user as { role?: string })?.role === "admin" ? session : null;
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: "math-guide",
      max_results: 100,
      resource_type: "image",
    });
    return NextResponse.json({ images: result.resources });
  } catch (err) {
    console.error("[GET /api/admin/images]", err);
    return NextResponse.json({ error: "Failed to list images" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const publicId = new URL(req.url).searchParams.get("publicId");
  if (!publicId) {
    return NextResponse.json({ error: "publicId required" }, { status: 400 });
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/admin/images]", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
