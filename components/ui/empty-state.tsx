import type { ReactNode } from "react";

export function EmptyState({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="flex min-h-20 items-center gap-3 px-4 py-4 sm:px-5">
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground [&>svg]:size-[18px]">
        {icon}
      </span>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
