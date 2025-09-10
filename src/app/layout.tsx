
import type { Metadata } from "next";
import { Ubuntu } from "next/font/google";
import "./globals.css";
import { AppThemeProvider } from "@/components/theme/theme-provider"; // your wrapper or use next-themes directly
import { AppSidebar } from "@/components/sections/AppSidebar";
import { ModeToggle } from "@/components/theme/ModeToggle";
import {NotificationBell} from "@/components/otherUi/NotificationBell";

const ubuntu = Ubuntu({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AutoChecker",
    description: "Drive with confidence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={ubuntu.className}>
        <AppThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60">
                        <div className="mx-auto flex max-w-7xl items-center justify-end gap-2 px-4 py-3 md:px-6">
                            <NotificationBell count={2} />
                            <ModeToggle />
                        </div>
                    </header>

                    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">{children}</main>
                </div>
            </div>
        </AppThemeProvider>
        </body>
        </html>
    );
}

