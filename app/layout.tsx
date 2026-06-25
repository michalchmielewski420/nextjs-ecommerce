import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "react-hot-toast"; // 🚀 IMPORT KONTENERA TOASTÓW

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
        <CartProvider>
          {children}
          {/* 🚀 TEN KOMPONENT ODPOWIADA ZA WYŚWIETLANIE TOASTÓW W PRAWYM GÓRNYM ROGU */}
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </CartProvider>
      </body>
    </html>
  );
}