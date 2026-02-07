"use client";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function SidebarItem({
  label,
  link,
  indicator,
  icon,
}: {
  label: string;
  link: string;
  indicator?: string;
  icon?: ReactNode;
}) {
  const pathName = usePathname();
  const active = pathName === link;

  return (
    <Link
      href={link}
      className={`px-4 py-2 rounded-lg cursor-pointer transition font-medium flex items-center gap-2
      ${active ? "text-[#11009E] bg-indigo-50" : "text-muted-foreground hover:ring hover:ring-[#11009E]"}`}
    >
      {icon}
      {label}
      {indicator && (
        <Badge className="rounded-full bg-[#11009E]">+ {indicator}</Badge>
      )}
    </Link>
  );
}
