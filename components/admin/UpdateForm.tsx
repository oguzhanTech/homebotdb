"use client";

import { useState } from "react";
import type { Update, UpdateType } from "@/types/update";
import type { EditorId } from "@/types/editor";
import { UPDATE_TYPE_LABELS } from "@/types/update";
import { getAllRobotSlugs } from "@/lib/data/repository";
import { getEditors } from "@/lib/editors";
import { saveUpdate } from "@/lib/data/admin-actions";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

const emptyUpdate: Partial<Update> = {
  title: "",
  slug: "",
  type: "data_update",
  authorId: undefined,
  robotSlug: "",
  summary: "",
  content: "",
  sourceUrl: "",
};

export function UpdateForm({
  initial,
  title = "Add update",
}: {
  initial?: Partial<Update>;
  title?: string;
}) {
  const [form, setForm] = useState<Partial<Update>>({ ...emptyUpdate, ...initial });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const robotSlugs = getAllRobotSlugs();
  const editors = getEditors();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.authorId) {
      setError("Pick an author. Every update needs a writer.");
      return;
    }

    if (!form.title?.trim() || !form.slug?.trim() || !form.summary?.trim()) {
      setError("Title, slug, and summary are required.");
      return;
    }

    const result = await saveUpdate(form);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setMessage(result.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[18px] border border-line bg-panel-strong p-6 shadow-card"
    >
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Author (required)
        </span>
        <select
          required
          className="mt-2 h-[42px] w-full cursor-pointer rounded-[14px] border border-line bg-white px-3 text-sm"
          value={form.authorId ?? ""}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              authorId: (e.target.value || undefined) as EditorId | undefined,
            }))
          }
        >
          <option value="">Select author</option>
          {editors.map((editor) => (
            <option key={editor.id} value={editor.id}>
              {editor.name} — {editor.role}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Title
        </span>
        <SearchInput
          className="mt-2"
          value={form.title ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Slug
        </span>
        <SearchInput
          className="mt-2"
          value={form.slug ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Type
        </span>
        <select
          className="mt-2 h-[42px] w-full cursor-pointer rounded-[14px] border border-line bg-white px-3 text-sm"
          value={form.type}
          onChange={(e) =>
            setForm((p) => ({ ...p, type: e.target.value as UpdateType }))
          }
        >
          {Object.entries(UPDATE_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Robot (optional)
        </span>
        <select
          className="mt-2 h-[42px] w-full cursor-pointer rounded-[14px] border border-line bg-white px-3 text-sm"
          value={form.robotSlug ?? ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, robotSlug: e.target.value || undefined }))
          }
        >
          <option value="">None</option>
          {robotSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {slug}
            </option>
          ))}
        </select>
      </label>

      {form.type === "news" ? (
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Cover image (optional)
          </span>
          <SearchInput
            className="mt-2"
            placeholder="/images/news/your-cover.jpg"
            value={form.coverImage ?? ""}
            onChange={(e) =>
              setForm((p) => ({ ...p, coverImage: e.target.value || undefined }))
            }
          />
          <p className="mt-2 text-xs text-muted">
            Used in the article and social previews. 1200×630 recommended.
          </p>
        </label>
      ) : null}

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Summary
        </span>
        <textarea
          className="mt-2 min-h-[70px] w-full rounded-[14px] border border-line bg-white px-3 py-2 text-sm"
          value={form.summary ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Content
        </span>
        <textarea
          className="mt-2 min-h-[120px] w-full rounded-[14px] border border-line bg-white px-3 py-2 text-sm"
          value={form.content ?? ""}
          onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
        />
      </label>

      <label className="block">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          Source URL (optional)
        </span>
        <SearchInput
          className="mt-2"
          value={form.sourceUrl ?? ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, sourceUrl: e.target.value || undefined }))
          }
        />
      </label>

      {error && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      <Button type="submit">Save update (demo)</Button>
      {message && (
        <p className="rounded-xl bg-blue-soft px-4 py-3 text-sm text-blue">{message}</p>
      )}
    </form>
  );
}
