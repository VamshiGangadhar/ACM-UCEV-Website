import React from "react";
import { Menubar } from "primereact/menubar";
import Image from "next/image";

function Navbar() {
  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      url: "/",
    },
    {
      label: "Team",
      icon: "pi pi-fw pi-users",
      items: [
        {
          label: "Faculty Incharge",
          icon: "pi pi-fw pi-book",
        },
        {
          label: "Our Team",
          icon: "pi pi-fw pi-users",
        },
      ],
    },
    {
      label: "Join Us",
      icon: "pi pi-fw pi-user-plus",
    },
    {
      label: "Events",
      icon: "pi pi-fw pi-calendar",
      items: [
        {
          label: "Event calender",
          icon: "pi pi-fw pi-calendar",
        },
        {
          label: "Achieves",
          icon: "pi pi-fw pi-calendar-times",
        },
      ],
    },
    {
      label: "Gallery",
      icon: "pi pi-fw pi-images",
    },
    {
      label: "Contact",
      icon: "pi pi-fw pi-phone",
    },
  ];
  return (
    <>
      <Menubar
        className="nav"
        start={
          <Image
            className="nav__acmLogo"
            src="/imgs/acm-logo.svg"
            width={150}
            height={55}
            alt="ACM logo"
          />
        }
        model={items}
      />
      <style jsx global>{`
        .nav {
          padding: 15px 20px;
          border: none;
          border-bottom: 2px solid #e5e5e5;
          max-width: var(--max-width);
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
        }
        .nav__acmLogo {
          width: 100% !important;
        }
      `}</style>
    </>
  );
}

export default Navbar;
