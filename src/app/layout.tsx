import type { Metadata } from "next";
import { Space_Mono, Syne } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { UIContextProvider } from "@/lib/ui-context";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "700", "800"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "RAZINGER // Personal AI Command Center",
  description:
    "AI-powered command center for cybersecurity, prompt engineering, trend intelligence, and code architecture by Josef Razinger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${syne.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UIContextProvider>
          {children}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#080c10',
                color: '#e2e8f0',
                border: '1px solid #1c2a3a',
                fontFamily: 'var(--font-space-mono)',
                fontSize: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#00f5a0',
                  secondary: '#000',
                },
              },
            }}
          />
        </UIContextProvider>
      </body>
    </html>
  );
}
