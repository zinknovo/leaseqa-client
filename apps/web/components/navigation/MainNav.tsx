"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";

const NAV_ITEMS = [
    {label: "Overview", href: "/"},
    {label: "AI Review", href: "/ai-review"},
    {label: "Q&A Board", href: "/qa"},
    {label: "Admin", href: "/admin"},
];

//TODO: no usage
export function MainNav() {
    const pathname = usePathname();

    return (
        <nav className="border-t border-white/10 bg-[var(--nav-bg)] shadow-inner shadow-black/20">
            <div className="mx-auto flex w-full max-w-6xl items-center gap-2 overflow-x-auto px-4">
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        item.href === "/"
                            ? pathname === "/"
                            : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative px-3 py-3 text-sm font-medium transition ${
                                isActive
                                    ? "text-white"
                                    : "text-slate-200 hover:text-white focus-visible:text-white"
                            }`}
                        >
                            {item.label}
                            {isActive && (
                                <span
                                    className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-[var(--avatar-start)] to-[var(--accent-cyan)]"/>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
