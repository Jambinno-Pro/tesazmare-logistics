"use client";

import { Menu, PanelLeftClose, PanelLeftOpen, Bell } from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminTopbarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenMobile: () => void;
}

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pricing": "Pricing Management",
  "/admin/bookings": "Bookings",
  "/admin/emails": "Emails Centre",
  "/admin/reviews": "Reviews",
  "/admin/gallery": "Gallery",
  "/admin/settings": "Admin Settings",
};

export default function AdminTopbar({
  collapsed,
  onToggleCollapse,
  onOpenMobile,
}: AdminTopbarProps) {
  const pathname = usePathname();

  const title =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(
      ([path]) => path !== "/admin" && pathname.startsWith(`${path}/`),
    )?.[1] ||
    "Administration";

  return (
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-7">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          aria-label="Open navigation"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <button
          onClick={onToggleCollapse}
          aria-label="Toggle sidebar"
          className="hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:block"
        >
          {collapsed ? (
            <PanelLeftOpen size={21} />
          ) : (
            <PanelLeftClose size={21} />
          )}
        </button>

        <div>
          <h1 className="text-lg font-bold text-[#172b45]">{title}</h1>
          <p className="hidden text-xs text-gray-500 sm:block">
            TESAZMARE Logistics Administration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative rounded-xl border border-gray-200 p-2.5 text-gray-600 hover:bg-gray-50"
        >
          <Bell size={19} />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#172b45] text-sm font-bold text-[#eaca21]">
            A
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#172b45]">
              Administrator
            </p>
            <p className="text-[11px] text-gray-500">Admin Account</p>
          </div>
        </div>
      </div>
    </header>
  );
}
