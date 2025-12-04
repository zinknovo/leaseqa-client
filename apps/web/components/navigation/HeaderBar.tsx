"use client";

import Link from "next/link";
import {Container, Navbar, NavbarBrand, Stack} from "react-bootstrap";
import {FaSearch} from "react-icons/fa";

export default function HeaderBar() {
    return (
        <Navbar expand="lg" className="bg-white border-bottom" style={{boxShadow: "var(--shadow-md)"}}>
            <Container fluid className="px-4">
                <NavbarBrand className="d-flex align-items-center gap-2">
                    <span className="fw-bold">LeaseQA</span>
                    <span className="d-none d-lg-inline text-muted-light" style={{fontSize: "0.9rem"}}>
                        · where laws can't reach
                    </span>
                </NavbarBrand>

                <Stack direction="horizontal" gap={3}>
                    <div className="search-box d-none d-md-flex">
                        <FaSearch className="text-muted-light" size={14}/>
                        <span className="text-muted-light" style={{fontSize: "0.875rem"}}>Search...</span>
                    </div>

                    <Link href="/account">
                        <div className="icon-circle icon-circle-md icon-bg-purple hover-scale"
                             style={{cursor: "pointer"}}>
                            <span className="fw-semibold" style={{fontSize: "0.875rem"}}>CA</span>
                        </div>
                    </Link>
                </Stack>
            </Container>
        </Navbar>
    );
}