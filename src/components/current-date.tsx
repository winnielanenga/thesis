"use client";

import { useEffect, useState } from "react";

function format(d: Date) {
    return d.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    });
}

/**
 * Renders today's date in the user's local timezone, not the server's.
 * Updates at midnight and on tab refocus so the date stays correct
 * even if the page is left open across days.
 */
export function CurrentDate() {
    const [date, setDate] = useState(() => format(new Date()));

    useEffect(() => {
        // Re-render once mounted so the client timezone replaces the server's.
        setDate(format(new Date()));

        let timeoutId: ReturnType<typeof setTimeout>;
        const scheduleNextMidnight = () => {
            const now = new Date();
            const next = new Date(now);
            next.setHours(24, 0, 1, 0); // 1s past midnight to avoid races
            timeoutId = setTimeout(() => {
                setDate(format(new Date()));
                scheduleNextMidnight();
            }, next.getTime() - now.getTime());
        };
        scheduleNextMidnight();

        const onFocus = () => setDate(format(new Date()));
        window.addEventListener("focus", onFocus);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("focus", onFocus);
        };
    }, []);

    return <span suppressHydrationWarning>{date}</span>;
}
