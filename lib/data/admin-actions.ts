import type { Robot } from "@/types/robot";
import type { Update } from "@/types/update";

export interface AdminActionResult {
  ok: boolean;
  message: string;
}

export async function saveRobot(_robot: Partial<Robot>): Promise<AdminActionResult> {
  return {
    ok: true,
    message: "Saved locally (demo). Database integration coming soon.",
  };
}

export async function deleteRobot(_slug: string): Promise<AdminActionResult> {
  return {
    ok: true,
    message: "Delete queued (demo). Database integration coming soon.",
  };
}

export async function saveUpdate(update: Partial<Update>): Promise<AdminActionResult> {
  if (!update.authorId) {
    return {
      ok: false,
      message: "Author is required for every update.",
    };
  }

  return {
    ok: true,
    message: "Update saved locally (demo). Database integration coming soon.",
  };
}

export async function savePriceHistory(
  _robotSlug: string,
  _entry: Robot["priceHistory"][number],
): Promise<AdminActionResult> {
  return {
    ok: true,
    message: "Price history saved locally (demo).",
  };
}
