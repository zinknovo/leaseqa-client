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
            className="d-none d-md-flex flex-column position-fixed top-0 bottom-0 z-3 align-items-center py-4"
            style={{
                width: 100,
                background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)"
            }}
        >
            <Link
                href="https://www.northeastern.edu/"
                target="_blank"
                className="mb-4"
            >
                <div
                    className="d-flex align-items-center justify-content-center rounded-3"
                    style={{
                        width: 56,
                        height: 56,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        transition: "all 0.2s ease"
                    }}
                >
                    <img
                        src="/images/NEU.png"
                        width={40}
                        height={40}
                        alt="NEU"
                        className="rounded-2"
                    />
                </div>
            </Link>

            <div
                className="mb-4"
                style={{
                    width: "40px",
                    height: "2px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "1px"
                }}
            />

            <nav className="d-flex flex-column gap-2 w-100 px-2">
                {NAV_ITEMS.map((item) => {
                    const isActive =
                        pathname === item.href || pathname.startsWith(`${item.href}/`);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-decoration-none"
                        >
                            <div
                                className="d-flex flex-column align-items-center py-3 rounded-3"
                                style={{
                                    background: isActive
                                        ? "linear-gradient(135deg, #e94560 0%, #ff6b6b 100%)"
                                        : "transparent",
                                    transition: "all 0.2s ease",
                                    cursor: "pointer"
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = "transparent";
                                    }
                                }}
                            >
                                <item.icon
                                    style={{
                                        fontSize: "1.5rem",
                                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)"
                                    }}
                                />
                                <span
                                    className="mt-1"
                                    style={{
                                        fontSize: "0.7rem",
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                                        letterSpacing: "0.5px"
                                    }}
                                >
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/*TODO: whether should add this*/}
            <div className="mt-auto">
                <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                        width: 40,
                        height: 40,
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    }}
                >
                    <span style={{fontSize: "1rem"}}>⚙️</span>
                </div>
            </div>
        </aside>
    );
}