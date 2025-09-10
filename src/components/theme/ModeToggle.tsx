"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ModeToggle() {
    const { theme, setTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(currentTheme === "light" ? "dark" : "light")}
            aria-label="Toggle theme"
            className="relative flex items-center justify-center rounded-full p-3"
        >
            <Sun className="h-6 w-6 transition-all dark:hidden text-emerald-500" />
            <Moon className="hidden h-6 w-6 transition-all dark:block text-cyan-400" />
        </Button>
    );
}
