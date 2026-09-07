import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-oklch(0.21 0.006 285.885)/10 dark:bg-oklch(0.92 0.004 286.32)/10",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
