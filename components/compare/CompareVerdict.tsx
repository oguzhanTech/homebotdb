import type { CompareVerdict as CompareVerdictData } from "@/lib/compare-summary";
import { uiCopy } from "@/config/ui-copy";
import { Card } from "@/components/ui/Card";

export function CompareVerdict({ verdict }: { verdict: CompareVerdictData }) {
  return (
    <Card className="mb-5 bg-panel-strong p-5 sm:p-6">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">
        {uiCopy.compare.verdict.title}
      </h2>
      <p className="mt-2 text-lg font-medium tracking-tight text-ink sm:text-xl">
        {verdict.headline}
      </p>
      {verdict.detail ? (
        <p className="mt-2 text-sm leading-relaxed text-muted">{verdict.detail}</p>
      ) : null}
    </Card>
  );
}
