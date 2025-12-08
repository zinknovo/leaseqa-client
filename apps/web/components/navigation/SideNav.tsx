"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {NAV_ITEMS} from "./config";

export default function SideNav() {
    const pathname = usePathname();

    return (
        <aside
            className="d-none d-md-flex flex-column position-fixed top-0 bottom-0 z-3 align-items-center py-4 sidenav-container">

            <Link href="https://www.northeastern.edu/" target="_blank" className="mb-4">
                <div className="icon-circle icon-circle-xl icon-bg-glass">
                    <img src="/images/NEU.png" width={40} height={40} alt="NEU" className="rounded-2"/>
                </div>
            </Link>

            <div className="mb-4 sidenav-divider"/>

            <nav className="d-flex flex-column gap-2 w-100 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link key={item.href} href={item.href} className="text-decoration-none">
                            <div
                                className={`d-flex flex-column align-items-center py-3 rounded-3 nav-item-hover ${isActive ? "bg-gradient-red" : ""}`}>
                                <item.icon
                                    className={`sidenav-icon ${isActive ? "sidenav-icon-active" : "sidenav-icon-inactive"}`}/>
                                <span
                                    className={`mt-1 sidenav-label ${isActive ? "sidenav-label-active" : "sidenav-label-inactive"}`}>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
            </div>
        </aside>
    );
}
