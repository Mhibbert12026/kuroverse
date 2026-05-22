import { TopNav } from "@/app/components/TopNav";

type ProtectedPageLoadingProps = {
  label?: string;
};

export function ProtectedPageLoading({ label = "Checking your session…" }: ProtectedPageLoadingProps) {
  return (
    <div className="film-grain relative min-h-screen bg-background">
      <TopNav />
      <main className="relative z-10 mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 pt-20 sm:pt-24">
        <div className="auth-protected-loading" role="status" aria-live="polite">
          <span className="auth-modal__spinner auth-protected-loading__spinner" aria-hidden />
          <p className="auth-protected-loading__text">{label}</p>
        </div>
      </main>
    </div>
  );
}
