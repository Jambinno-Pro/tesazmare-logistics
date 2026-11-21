import Link from "next/link";
import {
  Wallet,
  CalendarCheck,
  Mail,
  Star,
  Images,
  ArrowUpRight,
  Settings,
} from "lucide-react";

const modules = [
  {
    title: "Pricing Management",
    description: "Manage shuttle services, routes and passenger rates.",
    href: "/admin/pricing",
    icon: Wallet,
  },
  {
    title: "Bookings",
    description: "View and manage customer shuttle bookings.",
    href: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Emails Centre",
    description: "Manage customer enquiries and messages.",
    href: "/admin/emails",
    icon: Mail,
  },
  {
    title: "Reviews",
    description: "Review and approve customer feedback.",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Gallery",
    description: "Manage photos displayed on your website.",
    href: "/admin/gallery",
    icon: Images,
  },
  {
    title: "Admin Settings",
    description: "Manage your administrator and website settings.",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section>
        <p className="mb-2 text-xs font-bold uppercase tracking-[2px] text-[#c39843]">
          Administration Portal
        </p>

        <h2 className="text-2xl font-bold text-[#172b45] sm:text-3xl">
          Welcome to TESAZMARE
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Manage your shuttle services, bookings, pricing and website content
          from one central location.
        </p>
      </section>

      <section>
        <div className="mb-5">
          <h3 className="text-lg font-bold text-[#172b45]">
            Management Modules
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a module to get started.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.href}
                href={module.href}
                className="group rounded-2xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:border-[#eaca21] hover:shadow-lg"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#172b45] text-[#eaca21]">
                    <Icon size={23} />
                  </div>

                  <ArrowUpRight
                    size={20}
                    className="text-gray-400 transition group-hover:text-[#c39843]"
                  />
                </div>

                <h4 className="font-bold text-[#172b45]">{module.title}</h4>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {module.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
