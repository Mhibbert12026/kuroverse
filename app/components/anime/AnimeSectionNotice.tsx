type AnimeSectionNoticeProps = {
  message: string;
  variant?: "error" | "empty";
};

export function AnimeSectionNotice({
  message,
  variant = "error",
}: AnimeSectionNoticeProps) {
  const styles =
    variant === "error"
      ? "border-accent-orange/30 bg-accent-orange/10 text-accent-orange"
      : "border-white/10 bg-white/5 text-white/50";

  return (
    <p className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{message}</p>
  );
}
