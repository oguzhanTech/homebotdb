"use client";

import { useState } from "react";
import type { Robot, DataStatus, RobotType, PrimaryTask } from "@/types/robot";
import {
  COMMERCIAL_STATUS_LABELS,
  PRIMARY_TASK_LABELS,
  ROBOT_TYPE_LABELS,
} from "@/types/robot";
import { saveRobot } from "@/lib/data/admin-actions";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/SearchInput";

const DATA_STATUSES: DataStatus[] = ["confirmed", "unconfirmed", "coming_soon"];

const emptyRobot: Partial<Robot> = {
  name: "",
  slug: "",
  brand: "",
  type: "humanoid",
  primaryTask: "home_assistant",
  shortDescription: "",
  longDescription: "",
  price: "",
  priceStatus: "unknown",
  batteryLife: "",
  chargeTime: "",
  height: "",
  weight: "",
  speed: "",
  payload: "",
  sensors: "",
  processor: "",
  connectivity: "",
  readinessScore: 0,
  realityScore: 0,
  commercialStatus: "unknown",
  availabilityStatus: "unknown",
  countriesAvailable: [],
  firstAnnounced: "",
  lastUpdated: new Date().toISOString().slice(0, 10),
  imageUrl: "",
  videoUrls: [],
  affiliateUrl: "",
  sourceUrls: [],
  similarRobotSlugs: [],
  capabilities: [],
  ecosystem: [],
  reviews: [],
  tags: [],
  fieldMeta: {},
  priceHistory: [],
};

export function RobotForm({
  initial,
  title,
}: {
  initial?: Partial<Robot>;
  title: string;
}) {
  const [form, setForm] = useState<Partial<Robot>>({ ...emptyRobot, ...initial });
  const [message, setMessage] = useState("");
  const [fieldStatus, setFieldStatus] = useState<DataStatus>("unconfirmed");

  const update = (key: keyof Robot, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await saveRobot(form);
    setMessage(result.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-[18px] border border-line bg-panel-strong p-6 shadow-card"
    >
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            ["name", "Name"],
            ["slug", "Slug"],
            ["brand", "Brand"],
            ["price", "Price"],
            ["batteryLife", "Battery life"],
            ["height", "Height"],
            ["weight", "Weight"],
            ["readinessScore", "Readiness score"],
            ["realityScore", "Reality score"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
              {label}
            </span>
            <SearchInput
              className="mt-2"
              value={String(form[key] ?? "")}
              onChange={(e) =>
                update(
                  key,
                  key.includes("Score")
                    ? Number(e.target.value)
                    : e.target.value,
                )
              }
            />
          </label>
        ))}

        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Type
          </span>
          <select
            className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm"
            value={form.type}
            onChange={(e) => update("type", e.target.value as RobotType)}
          >
            {Object.entries(ROBOT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Primary task
          </span>
          <select
            className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm"
            value={form.primaryTask}
            onChange={(e) => update("primaryTask", e.target.value as PrimaryTask)}
          >
            {Object.entries(PRIMARY_TASK_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Commercial status
          </span>
          <select
            className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm"
            value={form.commercialStatus}
            onChange={(e) => update("commercialStatus", e.target.value)}
          >
            {Object.entries(COMMERCIAL_STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Short description
          </span>
          <textarea
            className="mt-2 min-h-[80px] w-full rounded-[14px] border border-line bg-white px-3 py-2 text-sm"
            value={form.shortDescription ?? ""}
            onChange={(e) => update("shortDescription", e.target.value)}
          />
        </label>

        <label className="block md:col-span-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Source URL
          </span>
          <SearchInput
            className="mt-2"
            placeholder="https://"
            onChange={(e) => update("sourceUrls", [e.target.value])}
          />
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Field data status
          </span>
          <select
            className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm"
            value={fieldStatus}
            onChange={(e) => setFieldStatus(e.target.value as DataStatus)}
          >
            {DATA_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Countries (comma separated)
          </span>
          <SearchInput
            className="mt-2"
            placeholder="United States, Germany"
            value={(form.countriesAvailable ?? []).join(", ")}
            onChange={(e) =>
              update(
                "countriesAvailable",
                e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              )
            }
          />
        </label>
      </div>

      <Button type="submit">Save robot (demo)</Button>
      {message && (
        <p className="rounded-xl bg-blue-soft px-4 py-3 text-sm text-blue">{message}</p>
      )}
    </form>
  );
}
