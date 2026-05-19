"use client";

import { InlineMath, BlockMath } from "react-katex";
import { cn } from "@/lib/utils";

type Props = {
  children: string;
  inline?: boolean;
  className?: string;
};

export function MathRender({ children, inline, className }: Props) {
  return (
    <span className={cn("text-foreground", className)}>
      {inline ? <InlineMath math={children} /> : <BlockMath math={children} />}
    </span>
  );
}

export function MixedText({ text }: { text: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("$") && part.endsWith("$") && part.length > 2) {
          return <MathRender key={i} inline children={part.slice(1, -1)} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
