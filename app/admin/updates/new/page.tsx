import Link from "next/link";
import { siteConfig } from "@/config/site";
import { buildPageMetadata } from "@/lib/seo";
import { UpdateForm } from "@/components/admin/UpdateForm";

export const metadata = buildPageMetadata({
  title: `Add Update — Admin — ${siteConfig.name}`,
  description: "Create a robot update or news entry.",
  path: "/admin/updates/new",
});

export default function AdminNewUpdatePage() {
  return (
    <main className="px-3.5 py-5 sm:px-7 sm:py-7">
      <Link href="/admin" className="text-xs font-bold uppercase tracking-wider text-blue">
        ← Admin
      </Link>
      <div className="mx-auto mt-6 max-w-2xl">
        <UpdateForm />
      </div>
    </main>
  );
}
