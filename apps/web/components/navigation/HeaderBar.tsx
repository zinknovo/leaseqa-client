"use client";

import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState, signOut} from "@/app/store";
import {Container, Dropdown, Navbar, NavbarBrand, Stack} from "react-bootstrap";
import {FaBell, FaSearch} from "react-icons/fa";
import AvatarToggle from "./HeaderBar/AvatarToggle";
import MobileNav from "./HeaderBar/MobileNav";
import ProfileHeader from "./HeaderBar/ProfileHeader";
import ProfileMenuItems from "./HeaderBar/ProfileMenuItems";
import * as client from "@/app/account/client";

export default function HeaderBar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const session = useSelector((state: RootState) => state.session);
    const user = session.user;
    const isAuthenticated = session.status === "authenticated" && !!user;
    const isGuest = session.status === "guest";
    const hasUser = isAuthenticated || isGuest;

    const [showMenu, setShowMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const notifications: {id: string; title: string; href?: string}[] = [];

    const initials = user?.name?.slice(0, 2).toUpperCase() || "?";

    const navigate = (href: string) => {
        setShowMenu(false);
        router.push(href);
    };

    const handleSignOut = async () => {
        try {
            await client.logout();
        } finally {
            localStorage.removeItem("guest_session");
            dispatch(signOut());
            navigate("/");
        }
    };

    return (
        <Navbar expand={false} className="bg-white border-bottom header-shadow">
            <Container fluid className="px-3">
                <div className="d-flex align-items-center gap-2">
                    <Navbar.Toggle aria-controls="mobile-navbar-nav" className="d-md-none border-0 p-0 me-2"/>
                    <NavbarBrand className="d-flex align-items-center gap-2 me-0">
                        <span
                            className="fw-bold"
                            style={{
                                fontFamily: "Poppins, 'Inter', sans-serif",
                                letterSpacing: "0.3px",
                                fontSize: "1.05rem",
                            }}
                        >
                            LeaseQA
                        </span>
                        <span
                            className="d-none d-lg-inline text-muted-light header-tagline"
                            style={{
                                fontFamily: "Poppins, 'Inter', sans-serif",
                                letterSpacing: "0.4px",
                                fontWeight: 500,
                            }}
                        >
                            · where statutes can't reach
                        </span>
                    </NavbarBrand>
                </div>

                <MobileNav pathname={pathname}/>

                <Stack direction="horizontal" gap={2}>
                    <Dropdown align="end" show={showNotifications} onToggle={setShowNotifications}>
                        <Dropdown.Toggle
                            as="button"
                            className="border-0 bg-transparent p-0 d-flex align-items-center"
                            aria-label="Open notifications"
                        >
                            <div className="icon-circle icon-circle-md icon-bg-muted hover-scale" style={{cursor: "pointer"}}>
                                <FaBell className="text-secondary" size={16}/>
                            </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="shadow-sm" style={{minWidth: 240}}>
                            <div className="px-3 py-2 fw-semibold">Notifications</div>
                            <Dropdown.Divider />
                            {notifications.length === 0 ? (
                                <div className="px-3 py-2 text-secondary small">No new notifications</div>
                            ) : (
                                notifications.map((item) => (
                                    <Dropdown.Item
                                        key={item.id}
                                        onClick={() => {
                                            setShowNotifications(false);
                                            if (item.href) navigate(item.href);
                                        }}
                                    >
                                        {item.title}
                                    </Dropdown.Item>
                                ))
                            )}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown align="end" show={showMenu} onToggle={setShowMenu}>
                        <Dropdown.Toggle as={AvatarToggle} initials={initials} isAuthenticated={isAuthenticated} isGuest={isGuest}/>
                        <Dropdown.Menu className="shadow-sm profile-menu">
                            <ProfileHeader user={user} initials={initials} isAuthenticated={isAuthenticated} isGuest={isGuest}/>
                            <Dropdown.Divider/>
                            <ProfileMenuItems
                                isAuthenticated={isAuthenticated}
                                isGuest={isGuest}
                                navigate={navigate}
                                onSignOut={handleSignOut}
                            />
                        </Dropdown.Menu>
                    </Dropdown>
                </Stack>
            </Container>
        </Navbar>
    );
}
