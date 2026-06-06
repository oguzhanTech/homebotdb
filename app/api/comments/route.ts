import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createComment, listComments } from "@/lib/data/comments";
import type { CommentTargetType } from "@/types/comment";

function isTargetType(value: string): value is CommentTargetType {
  return value === "robot" || value === "news";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetType = searchParams.get("targetType") ?? "";
  const targetSlug = searchParams.get("targetSlug") ?? "";

  if (!isTargetType(targetType) || !targetSlug.trim()) {
    return NextResponse.json(
      { ok: false, message: "targetType and targetSlug are required." },
      { status: 400 },
    );
  }

  const comments = await listComments(targetType, targetSlug.trim());
  return NextResponse.json({ ok: true, comments });
}

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const data = payload as Record<string, unknown>;
  const targetType = typeof data.targetType === "string" ? data.targetType : "";
  const targetSlug = typeof data.targetSlug === "string" ? data.targetSlug.trim() : "";
  const username = typeof data.username === "string" ? data.username : "";
  const body = typeof data.body === "string" ? data.body : "";
  const parentId =
    typeof data.parentId === "string" && data.parentId.trim()
      ? data.parentId.trim()
      : null;

  if (!isTargetType(targetType) || !targetSlug) {
    return NextResponse.json(
      { ok: false, message: "targetType and targetSlug are required." },
      { status: 400 },
    );
  }

  const result = await createComment({
    targetType,
    targetSlug,
    username,
    body,
    parentId,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  if (targetType === "robot") {
    revalidatePath(`/robots/${targetSlug}`);
  } else {
    revalidatePath(`/news/${targetSlug}`);
  }

  return NextResponse.json(result, { status: 201 });
}
