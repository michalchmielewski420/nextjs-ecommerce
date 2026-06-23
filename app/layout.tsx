import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context"; // 🚀 IMPORT PROVIDERA

export const metadata: Metadata = {
  title: "MEGA_SHOP",
  description: "Mój super szybki sklep e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body>
        {/* Opałowujemy całą aplikację naszym koszykiem */}
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}