"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListGroup } from "react-bootstrap";
import {
  FaHouse,
  FaRobot,
  FaComments,
  FaCircleUser,
  FaCircleInfo,
} from "react-icons/fa6";

const NAV_ITEMS = [
  { label: "Home", href: "/", icon: FaHouse },
  { label: "AI Review", href: "/ai-review", icon: FaRobot },
  { label: "QA", href: "/qa", icon: FaComments },
  { label: "Account", href: "/account", icon: FaCircleUser },
  { label: "Info", href: "/info", icon: FaCircleInfo },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside
      className="bg-black text-white d-none d-md-flex flex-column position-fixed top-0 bottom-0 z-3 align-items-center py-3"
      style={{ width: 120 }}
    >
      <Link
        href="https://www.northeastern.edu/"
        target="_blank"
        className="text-center mb-3 text-decoration-none text-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/NEU.png"
          width="72"
          height="72"
          alt="NEU"
          className="rounded-2"
        />
        <div className="small mt-2 text-secondary">NEU</div>
      </Link>

      <ListGroup variant="flush" className="w-100">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <ListGroup.Item
              key={item.href}
              className={`border-0 bg-black text-center py-3 ${
                isActive ? "active-link" : ""
              }`}
            >
              <Link
                href={item.href}
                className={`d-block text-decoration-none ${
                  isActive ? "text-black" : "text-white"
                }`}
              >
                <item.icon
                  className={`fs-3 ${
                    isActive ? "text-danger" : "text-danger opacity-75"
                  }`}
                />
                <div className="small mt-1">{item.label}</div>
              </Link>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </aside>
  );
}
