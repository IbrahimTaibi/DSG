import { DarkModeProvider } from "./DarkModeProvider";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { SocketProvider } from "./SocketProvider";
import { NotificationProvider } from "./NotificationProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </DarkModeProvider>
  );
} 