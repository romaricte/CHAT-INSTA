import { auth } from "@/auth";
import { OnlineStatusProvider } from "@/components/providers/online-status-provider";
import { NotificationsProvider } from "@/components/providers/notifications-provider";
import { Toaster } from "sonner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  return (
    <OnlineStatusProvider userId={session.user.id}>
      <NotificationsProvider userId={session.user.id}>
        <Toaster />
        {children}
      </NotificationsProvider>
    </OnlineStatusProvider>
  );
}
