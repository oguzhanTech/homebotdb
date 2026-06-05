"use client";

import { useState } from "react";
import type { Update, UpdateType } from "@/types/update";
import { UPDATE_TYPE_LABELS } from "@/types/update";
import { getAllRobotSlugs } from "@/lib/data/repository";
import { saveUpdate } from "@/lib/data/admin-actions";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

export function UpdateForm() {
  const [form, setForm] = useState<Partial<Update>>({
    title: "",
    slug: "",
    type: "data_update",
    robotSlug: "",
    summary: "",
    content: "",
    sourceUrl: "",
  });
  const [message, setMessage] = useState("");
  const robotSlugs = getAllRobotSlugs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveUpdate(form);
    setMessage(result.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-[18px] border border-line bg-panel-strong p-6 shadow-card"
    >
      <h2 className="text-lg font-semibold tracking-tight">Add update</h2>

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
          className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm"
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
          className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm"
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

      <Button type="submit">Save update (demo)</Button>
      {message && (
        <p className="rounded-xl bg-blue-soft px-4 py-3 text-sm text-blue">{message}</p>
      )}
    </form>
  );
}
