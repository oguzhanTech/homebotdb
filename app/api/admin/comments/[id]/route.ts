import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import { deleteComment } from "@/lib/data/comments";
import { revalidateCommentTarget } from "@/lib/revalidate-comments";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;
  if (!id.trim()) {
    return NextResponse.json({ ok: false, message: "Comment id is required." }, { status: 400 });
  }

  try {
    const comment = await deleteComment(id.trim());
    if (!comment) {
      return NextResponse.json({ ok: false, message: "Comment not found." }, { status: 404 });
    }

    revalidateCommentTarget(comment.targetType, comment.targetSlug);

    return NextResponse.json({ ok: true, comment });
  } catch (error) {
    console.error("[admin comments DELETE]", error);
    return NextResponse.json(
      { ok: false, message: "Could not delete comment." },
      { status: 500 },
    );
  }
}
