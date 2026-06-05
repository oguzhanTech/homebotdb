"use client";

import { useState } from "react";
import type { Robot } from "@/types/robot";
import { savePriceHistory } from "@/lib/data/admin-actions";
import { Button } from "@/components/ui/Button";

export function PriceHistoryForm({
  robot,
}: {
  robot: Pick<Robot, "slug" | "name" | "priceHistory">;
}) {
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState<"confirmed" | "unconfirmed" | "coming_soon">(
    "unconfirmed",
  );
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await savePriceHistory(robot.slug, { date, price, status });
    setMessage(result.message);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[18px] border border-line bg-panel-strong p-6 shadow-card">
        <h2 className="text-lg font-semibold">Existing price history — {robot.name}</h2>
        <ul className="mt-4 space-y-2 text-sm">
          {robot.priceHistory.length > 0 ? (
            robot.priceHistory.map((entry) => (
              <li
                key={`${entry.date}-${entry.price}`}
                className="flex justify-between border-b border-line py-2"
              >
                <span>{entry.date}</span>
                <span className="font-mono font-bold">{entry.price}</span>
                <span className="text-muted">{entry.status}</span>
              </li>
            ))
          ) : (
            <li className="text-muted">No entries yet.</li>
          )}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-[18px] border border-line bg-panel-strong p-6 shadow-card"
      >
        <h3 className="font-semibold">Add price history entry</h3>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Date
          </span>
          <input
            className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-panel/82 px-4 text-sm shadow-card outline-none"
            type="date"
            value={date}
            onChange={(e) =>
              setDate((e.currentTarget as HTMLInputElement).value)
            }
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Price
          </span>
          <input
            className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-panel/82 px-4 text-sm shadow-card outline-none"
            value={price}
            onChange={(e) =>
              setPrice((e.currentTarget as HTMLInputElement).value)
            }
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
            Data status
          </span>
          <select
            className="mt-2 h-[42px] w-full rounded-[14px] border border-line bg-white px-3 text-sm"
            value={status}
            onChange={(e) =>
              setStatus(e.currentTarget.value as "confirmed" | "unconfirmed" | "coming_soon")
            }
          >
            <option value="confirmed">Confirmed</option>
            <option value="unconfirmed">Unconfirmed</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </label>
        <Button type="submit">Save entry (demo)</Button>
        {message && (
          <p className="rounded-xl bg-blue-soft px-4 py-3 text-sm text-blue">{message}</p>
        )}
      </form>
    </div>
  );
}
