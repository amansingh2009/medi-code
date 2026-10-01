import type { ElementType } from "react";

export function EmptyState({
  text,
  icon: Icon
}: {
  text: string;
  icon: ElementType;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
      <Icon className="mx-auto text-slate-300" size={32} />
      <div className="mt-3 text-sm text-slate-500">{text}</div>
    </div>
  );
}
