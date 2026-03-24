"use client";
import { SidebarItem } from "@/src/components/layout/SidebarItem";
import { useAuth } from "@/src/contexts/AuthContext";
import {
  Cat,
  ClipboardList,
  Contact2,
  Gauge,
  Loader2,
  MessageSquareWarning,
  Settings,
  Ticket,
  User2,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace("/auth");
    }
  }, [loading, session, router]);

  if (loading || !session) {
    return (
      <div className="flex justify-center animate-spin mt-70 text-[#11009E]">
        <Loader2 size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex ">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col">
        <div className="h-16 text-center pt-3 font-bold text-xl text-[#11009E]">
          <p>Homestay Booking</p>
          <p className="text-sm text-muted-foreground font-medium">
            Management
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-3 text-sm">
          <SidebarItem label="Dashboard" link="/" icon={<Gauge />} />
          <SidebarItem label="Users" link="/users" icon={<User2 />} />
          <SidebarItem
            label="Listings"
            link="/listings"
            indicator="3"
            icon={<Ticket />}
          />
          <SidebarItem
            label="Hosts"
            link="/hosts"
            indicator="2"
            icon={<Contact2 />}
          />
          <SidebarItem
            label="Bookings"
            link="/bookings"
            icon={<ClipboardList />}
          />
          <SidebarItem
            label="Reports"
            link="/reports"
            indicator="1"
            icon={<MessageSquareWarning />}
          />
          <SidebarItem label="Banner" link="/banner" icon={<ImageIcon />} />
          <SidebarItem label="Settings" link="/settings" icon={<Settings />} />
          <SidebarItem label="Test" link="/test" icon={<Cat />} />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        <main className="flex-1 p-6 bg-slate-100">{children}</main>
      </div>
    </div>
  );
}
