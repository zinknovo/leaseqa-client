import Link from "next/link";
import {useRouter} from "next/navigation";

import {Nav, Navbar, Offcanvas} from "react-bootstrap";

import {NAV_ITEMS} from "../config";

type MobileNavProps = {
    pathname: string;
};

export default function MobileNav({pathname}: MobileNavProps) {
    const router = useRouter();

    return (
        <Navbar.Offcanvas id="mobile-navbar-nav" aria-labelledby="mobile-navbar-label" placement="start">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title id="mobile-navbar-label" className="fw-bold">
                    LeaseQA
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Nav className="flex-column gap-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-2 ${
                                    isActive ? "bg-light text-primary fw-semibold" : "text-secondary"
                                }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    router.push(item.href);
                                }}
                            >
                                <item.icon size={18}/>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </Nav>
            </Offcanvas.Body>
        </Navbar.Offcanvas>
    );
}