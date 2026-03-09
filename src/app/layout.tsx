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
            <header className="flex items-center justify-between p-6 pb-4">
              <button className="h-11 w-11 rounded-full bg-[#27293d] flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-95 border border-white/5 shadow-sm">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="14" y1="6" y2="6" />
                  <line x1="10" x2="20" y1="18" y2="18" />
                </svg>
              </button>
              
              <div className="h-11 w-11 rounded-full overflow-hidden border-2 border-[#27293d] relative bg-black shadow-[0_0_15px_rgba(139,92,246,0.3)] ring-2 ring-[#1e1e2d] hover:scale-105 transition-transform cursor-pointer">
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
