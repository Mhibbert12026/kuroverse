import { ProtectedPageLoading } from "@/app/components/auth/ProtectedPageLoading";

export default function ProfileLoading() {
  return <ProtectedPageLoading label="Loading your profile…" />;
}
