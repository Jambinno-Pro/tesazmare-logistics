"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  CalendarCheck,
  Mail,
  Star,
  Images,
  Settings,
  BusFront,
  X,
  Home,
  ArrowUpRight,
} from "lucide-react";

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    title: "OVERVIEW",
    items: [{ label: "Dashboard", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "MANAGEMENT",
    items: [
      { label: "Pricing", href: "/admin/pricing", icon: Wallet },
      { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
      { label: "Emails Centre", href: "/admin/emails", icon: Mail },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Gallery", href: "/admin/gallery", icon: Images },
    ],
  },
  {
    title: "SYSTEM",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export default function AdminSidebar({
  collapsed,
  mobileOpen,
  onClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col
        bg-[#172b45] text-white transition-all duration-300
        ${collapsed ? "lg:w-[82px]" : "lg:w-[260px]"}
        w-[260px]
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand */}
        <div className="flex h-[76px] items-center justify-between border-b border-white/10 px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaca21] text-[#172b45]">
              <BusFront size={23} />
            </div>

            <div className={collapsed ? "lg:hidden" : ""}>
              <h2 className="text-sm font-bold tracking-wide">TESAZMARE</h2>
              <p className="text-[10px] uppercase tracking-[2px] text-[#eaca21]">
                Administration
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-7">
          {navigation.map((section) => (
            <div key={section.title}>
              <p
                className={`mb-3 px-3 text-[10px] font-semibold tracking-[2px] text-white/40 ${
                  collapsed ? "lg:hidden" : ""
                }`}
              >
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      title={collapsed ? item.label : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                        active
                          ? "bg-[#eaca21] font-semibold text-[#172b45]"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={19} className="shrink-0" />
                      <span className={collapsed ? "lg:hidden" : ""}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Back to Home */}
        <div className="px-3 pb-4">
          <Link
            href="/"
            onClick={onClose}
            title={collapsed ? "Back to Home" : undefined}
            className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-3 text-sm font-medium text-white/80 transition hover:border-[#eaca21]/40 hover:bg-white/10 hover:text-[#eaca21]"
          >
            <Home size={19} className="shrink-0" />

            <span className={collapsed ? "lg:hidden" : ""}>Back to Home</span>

            <ArrowUpRight
              size={16}
              className={`ml-auto shrink-0 ${collapsed ? "lg:hidden" : ""}`}
            />
          </Link>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <p
            className={`text-center text-[10px] text-white/40 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            TESAZMARE LOGISTICS
            <br />
            Administration Portal
          </p>

          {collapsed && (
            <p className="hidden text-center text-[10px] text-white/40 lg:block">
              TL
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
