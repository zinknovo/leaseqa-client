"use client";

import {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {RootState, signOut} from "@/app/store";
import {Container, Dropdown, Navbar, NavbarBrand, Stack} from "react-bootstrap";
import {FaSearch} from "react-icons/fa";
import * as client from "@/app/auth/client";
import AvatarToggle from "./HeaderBar/AvatarToggle";
import MobileNav from "./HeaderBar/MobileNav";
import ProfileHeader from "./HeaderBar/ProfileHeader";
import ProfileMenuItems from "./HeaderBar/ProfileMenuItems";

export default function HeaderBar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const session = useSelector((state: RootState) => state.session);
    const user = session.user;
    const isAuthenticated = session.status === "authenticated" && !!user;

    const [showMenu, setShowMenu] = useState(false);

    const initials = user?.name?.slice(0, 2).toUpperCase() || "CA";

    const navigate = (href: string) => {
        setShowMenu(false);
        router.push(href);
    };

    const handleSignOut = async () => {
        try {
            await client.logoutUser();
        } finally {
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
                        <span className="fw-bold">LeaseQA</span>
                        <span className="d-none d-lg-inline text-muted-light header-tagline">
                            · where statutes can't reach
                        </span>
                    </NavbarBrand>
                </div>

                <MobileNav pathname={pathname}/>

                <Stack direction="horizontal" gap={2}>
                    <div className="search-box d-none d-md-flex">
                        <FaSearch className="text-muted-light" size={14}/>
                        <span className="text-muted-light search-text">Search...</span>
                    </div>

                    <Dropdown align="end" show={showMenu} onToggle={setShowMenu}>
                        <Dropdown.Toggle as={AvatarToggle} initials={initials}/>
                        <Dropdown.Menu className="shadow-sm profile-menu">
                            <ProfileHeader user={user} initials={initials} isAuthenticated={isAuthenticated}/>
                            <Dropdown.Divider/>
                            <ProfileMenuItems
                                isAuthenticated={isAuthenticated}
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