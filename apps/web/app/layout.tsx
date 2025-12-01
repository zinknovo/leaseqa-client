import "@/app/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import SideNav from "@/components/navigation/SideNav";
import HeaderBar from "@/components/navigation/HeaderBar";

export const metadata: Metadata = {
  title: "LeaseQA",
  description:
    "AI-assisted lease review and legal Q&A platform for Boston renters.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          <div className="app-shell d-flex min-vh-100">
            <SideNav />
            <div className="flex-grow-1 d-flex flex-column content-shell">
              <HeaderBar />

              <main className="flex-grow-1">
                <div className="py-4 px-4 px-md-5">{children}</div>
              </main>

              <footer className="border-top bg-white py-3 px-4 text-secondary small">
                LeaseQA provides legal information and does not constitute
                formal legal advice. Consult a licensed attorney for
                case-specific guidance.
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
