import { editors } from "@/data/editors";
import type { Editor, EditorId } from "@/types/editor";

const byId = new Map(editors.map((editor) => [editor.id, editor]));

export function getEditors(): Editor[] {
  return editors;
}

export function getEditorById(id: EditorId): Editor {
  const editor = byId.get(id);
  if (!editor) {
    throw new Error(`Unknown editor: ${id}`);
  }
  return editor;
}

export function getEditorInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
