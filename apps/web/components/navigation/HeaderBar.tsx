"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import {forwardRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Badge, Container, Dropdown, Nav, Navbar, NavbarBrand, Offcanvas, Stack,} from "react-bootstrap";
import {FaSearch, FaShieldAlt} from "react-icons/fa";
import {NAV_ITEMS} from "./config";
import {RootState, signOut} from "@/app/store";
import {logoutUser} from "@/app/lib/api";

export default function HeaderBar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const session = useSelector((state: RootState) => state.session);
    const user = session.user;
    const isAuthenticated = session.status === "authenticated" && !!user;
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const initials =
        user?.name?.slice(0, 2).toUpperCase() ||
        user?.email?.slice(0, 2).toUpperCase() ||
        "CA";

    const AvatarToggle = forwardRef<HTMLButtonElement, { onClick?: (e: React.MouseEvent) => void }>(
        ({onClick}, ref) => (
            <button
                ref={ref}
                type="button"
                className="border-0 bg-transparent p-0"
                onClick={(e) => {
                    e.preventDefault();
                    onClick?.(e);
                }}
                aria-label="Open profile menu"
            >
                <div className="icon-circle icon-circle-md icon-bg-purple hover-scale post-item-clickable">
                    <span className="fw-semibold avatar-text-sm">{initials}</span>
                </div>
            </button>
        )
    );
    AvatarToggle.displayName = "AvatarToggle";

    const handleSignOut = async () => {
        try {
            await logoutUser();
        } catch (err) {
            // ignore logout error; client state will still clear
        } finally {
            dispatch(signOut());
            setShowProfileMenu(false);
            router.push("/");
        }
    };

    return (
        <Navbar expand={false} className="bg-white border-bottom header-shadow">
            <Container fluid className="px-3">
                <div className="d-flex align-items-center gap-2">
                    <Navbar.Toggle aria-controls="mobile-navbar-nav" className="d-md-none border-0 p-0 me-2"/>
                    <NavbarBrand className="d-flex align-items-center gap-2 me-0">
                        <span className="fw-bold">LeaseQA</span>
                        <span className="d-none d-lg-inline text-muted-light header-tagline">
                        · where statutes can't reach
                    </span>
                    </NavbarBrand>
                </div>

                <Navbar.Offcanvas
                    id="mobile-navbar-nav"
                    aria-labelledby="mobile-navbar-label"
                    placement="start"
                >
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
                                        className={`nav-link d-flex align-items-center gap-3 px-3 py-2 rounded-2 ${isActive ? "bg-light text-primary fw-semibold" : "text-secondary"}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item.href === "/qa") {
                                                router.push("/qa");
                                            } else {
                                                router.push(item.href);
                                            }
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

                <Stack direction="horizontal" gap={2}>
                    <div className="search-box d-none d-md-flex">
                        <FaSearch className="text-muted-light" size={14}/>
                        <span className="text-muted-light search-text">Search...</span>
                    </div>

                    <Dropdown
                        align="end"
                        show={showProfileMenu}
                        onToggle={(next) => setShowProfileMenu(next)}
                    >
                        <Dropdown.Toggle as={AvatarToggle}/>

                        <Dropdown.Menu className="shadow-sm profile-menu">
                            <div className="px-3 py-2">
                                {isAuthenticated ? (
                                    <div className="d-flex align-items-start gap-2">
                                        <div className="icon-circle icon-circle-sm icon-bg-purple profile-avatar-sm">
                                            <span className="fw-semibold avatar-text-xs">{initials}</span>
                                        </div>
                                        <div>
                                            <div className="fw-bold">{user?.name || "Account"}</div>
                                            <div className="text-muted small mb-1">{user?.email}</div>
                                            <Badge bg="light" text="dark"
                                                   className="d-inline-flex align-items-center gap-1">
                                                <FaShieldAlt size={12}/>
                                                <span className="text-capitalize">{user?.role || "tenant"}</span>
                                            </Badge>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="fw-bold mb-1">You are not signed in</div>
                                        <div className="text-muted small">Sign in to access your account and saved
                                            posts.
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Dropdown.Divider/>
                            {isAuthenticated ? (
                                <>
                                    <Dropdown.Item
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            router.push("/account");
                                        }}
                                    >
                                        Go to Account
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        className="text-danger"
                                        onClick={handleSignOut}
                                    >
                                        Sign out
                                    </Dropdown.Item>
                                </>
                            ) : (
                                <>
                                    <Dropdown.Item
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            router.push("/auth/login");
                                        }}
                                    >
                                        Sign In
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={() => {
                                            setShowProfileMenu(false);
                                            router.push("/auth/register");
                                        }}
                                    >
                                        Create Account
                                    </Dropdown.Item>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </Stack>
            </Container>
        </Navbar>
    );
}
