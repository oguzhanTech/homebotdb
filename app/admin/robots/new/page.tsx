import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { RobotForm } from "@/components/admin/RobotForm";

export const metadata = buildPageMetadata({
  title: `Add Robot — Admin — ${siteConfig.name}`,
  description: "Add a new home robot to the database.",
  path: "/admin/robots/new",
});

export default function AdminNewRobotPage() {
  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <Link href="/admin/robots" className="text-xs font-bold uppercase tracking-wider text-blue">
        ← Robots
      </Link>
      <div className="mx-auto mt-6 max-w-3xl">
        <RobotForm title="Add new robot" />
      </div>
    </main>
  );
}
