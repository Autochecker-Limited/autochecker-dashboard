"use client";

import * as React from "react";
import {useTheme} from "next-themes";
import {Button} from "@/components/ui/button";
import {Moon, Sun} from "lucide-react";

export function ModeToggle() {

    const {theme, setTheme, systemTheme} = useTheme();

    // resolve "system" into actual light/dark
    const currentTheme = theme === "system" ? systemTheme : theme;

    const toggleTheme = () => {
        if (currentTheme === "light") {
            setTheme("dark");
        } else {
            setTheme("light");
        }
    };
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="relative flex items-center justify-center rounded-full p-3"

        >
            {/* Sun Icon (light mode) */}
            <Sun
                className="h-6 w-6 transition-all dark:hidden  text-emerald-500"
            />

            {/* Moon Icon (dark mode) */}
            <Moon
                className="hidden h-6 w-6 transition-all dark:block text-cyan-400"
            />
        </Button>
    );
}