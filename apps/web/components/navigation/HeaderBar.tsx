"use client";

import { Navbar, Container } from "react-bootstrap";

export default function HeaderBar() {
  return (
    <Navbar bg="light" className="border-bottom shadow-sm" expand="lg">
      <Container fluid className="px-4">
        <Navbar.Brand className="fw-semibold">
          LeaseQA · where laws can&apos;t reach
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
