import type { Metadata } from "next";
import { AuthProvider } from "@/components/auth/auth/AuthContext";
import Cart from "@/components/cart/Cart";
import { CartProvider } from "@/components/cart/CartContext";
import QueryProvider from "@/providers/QueryProvider";
import "../../globals.css";

export const metadata: Metadata = {
  title: "OIL MASTER",
  description: "Premium oil shopping mall",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <Cart />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
