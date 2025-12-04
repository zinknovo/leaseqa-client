"use client";

import Link from "next/link";
import {usePathname} from "next/navigation";
import {FaCircleInfo, FaCircleUser, FaComments, FaHouse, FaRobot} from "react-icons/fa6";

const NAV_ITEMS = [
    {label: "Home", href: "/", icon: FaHouse},
    {label: "AI Review", href: "/ai-review", icon: FaRobot},
    {label: "QA", href: "/qa", icon: FaComments},
    {label: "Account", href: "/account", icon: FaCircleUser},
    {label: "Info", href: "/info", icon: FaCircleInfo},
];

export default function SideNav() {
    const pathname = usePathname();

    return (
        <aside
            className="d-none d-md-flex flex-column position-fixed top-0 bottom-0 z-3 align-items-center py-4 bg-gradient-dark"
            style={{width: "var(--nav-width)", background: "var(--gradient-sidenav)"}}>

            <Link href="https://www.northeastern.edu/" target="_blank" className="mb-4">
                <div className="icon-circle icon-circle-xl icon-bg-glass">
                    <img src="/images/NEU.png" width={40} height={40} alt="NEU" className="rounded-2"/>
                </div>
            </Link>

            <div className="mb-4" style={{width: 40, height: 2, background: "rgba(255,255,255,0.2)", borderRadius: 1}}/>

            <nav className="d-flex flex-column gap-2 w-100 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link key={item.href} href={item.href} className="text-decoration-none">
                            <div
                                className={`d-flex flex-column align-items-center py-3 rounded-3 nav-item-hover ${isActive ? "bg-gradient-red" : ""}`}>
                                <item.icon
                                    style={{fontSize: "1.5rem", color: isActive ? "#fff" : "rgba(255,255,255,0.7)"}}/>
                                <span className="mt-1" style={{
                                    fontSize: "0.7rem",
                                    fontWeight: isActive ? 600 : 400,
                                    color: isActive ? "#fff" : "rgba(255,255,255,0.7)"
                                }}>
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto">
                <div className="icon-circle icon-circle-md icon-bg-glass hover-scale" style={{cursor: "pointer"}}>
                    ⚙️
                </div>
            </div>
        </aside>
    );
}