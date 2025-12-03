"use client";

import Link from "next/link";
import {Container, Navbar, NavbarBrand, Stack} from "react-bootstrap";
import {FaSearch} from "react-icons/fa";

export default function HeaderBar() {
    return (
        <Navbar
            expand="lg"
            style={{
                background: "#ffffff",
                borderBottom: "1px solid #e9ecef",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
            }}
        >
            <Container fluid className="px-4">
                <NavbarBrand className="d-flex align-items-center gap-2">
                    <span className="fw-bold">LeaseQA</span>
                    <span
                        className="d-none d-lg-inline text-secondary"
                        style={{fontSize: "0.9rem", fontWeight: "normal"}}
                    >
                        · where laws can&apos;t reach
                    </span>
                </NavbarBrand>

                <Stack direction="horizontal" gap={3}>
                    {/*TODO: whether should add this*/}
                    <div
                        className="d-none d-md-flex align-items-center px-3 py-2 rounded-pill"
                        style={{
                            background: "#f8f9fa",
                            border: "1px solid #e9ecef",
                            cursor: "pointer"
                        }}
                    >
                        <FaSearch className="text-secondary me-2" size={14}/>
                        <span className="text-secondary" style={{fontSize: "0.875rem"}}>
                            Search...
                        </span>
                    </div>

                    <Link href="/account">
                        <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                                width: 40,
                                height: 40,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                cursor: "pointer",
                                color: "#fff",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                transition: "transform 0.2s ease"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            CA
                        </div>
                    </Link>
                </Stack>
            </Container>
        </Navbar>
    );
}