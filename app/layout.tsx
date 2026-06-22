import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../lib/cart-context";

export const metadata: Metadata = {
  title: "MEGA_SHOP 🛒",
  description: "Nowoczesny sklep e-commerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      {/* Usunęliśmy niestandardowe czcionki, teraz body korzysta z domyślnego, ładnego fontu systemowego */}
      <body className="antialiased bg-slate-50 text-slate-900">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}