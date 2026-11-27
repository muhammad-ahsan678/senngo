import type { ReactNode } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type SidebarItem = {
  href: string;
  label: string;
  icon: ReactNode;
  current?: boolean;
};

export function SidebarNav({ items }: { items: SidebarItem[] }) {
  return (
    <aside className="border-b border-sidebar-border bg-sidebar px-4 pt-4 pb-3 sm:px-6 lg:sticky lg:top-0 lg:h-dvh lg:border-r lg:border-b-0 lg:px-4 lg:pt-7">
      <a
        href="/"
        className="inline-flex items-center gap-2.5 rounded-lg px-1.5 py-1 text-xl font-bold tracking-tight lg:ml-1"
      >
        <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <Send aria-hidden="true" className="size-[18px]" />
        </span>
        Senngo
      </a>

      <nav aria-label="Main navigation" className="mt-3 lg:mt-10">
        <ul className="flex flex-wrap gap-1 lg:flex-col">
          {items.map(({ href, label, icon, current }) => (
            <li key={href}>
              <a
                href={href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:px-3.5",
                  current
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground",
                )}
              >
                <span aria-hidden="true" className="[&>svg]:size-4">
                  {icon}
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
