import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { AppProvider } from "@/lib/store";
import GlobalAlerts from "@/components/GlobalAlerts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpendSync Premium",
  description: "Modern personal expense tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "bg-[#1e1e2d] text-foreground min-h-screen relative selection:bg-primary/30")}>
        
        <AppProvider>
          <div className="flex flex-col min-h-screen w-full max-w-[500px] mx-auto bg-[#1e1e2d] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Mobile-First Top Bar */}
            <header className="flex items-center justify-between p-6">
              <button className="text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                </svg>
              </button>
              
              <div className="h-10 w-10 rounded-[0.7rem] overflow-hidden border border-white/5 relative bg-black">
                <img 
                  src="/avatar.png" 
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </header>

            <main className="flex-1 w-full flex flex-col px-6 pb-20">
              <GlobalAlerts />
              {children}
            </main>
          </div>
        </AppProvider>

      </body>
    </html>
  );
}
