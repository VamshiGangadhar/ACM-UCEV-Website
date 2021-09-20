import React from "react";
import { Menubar } from "primereact/menubar";
import Image from "next/image";
import { useRouter } from "next/router";

function Navbar() {
  const router = useRouter();
  const items = [
    {
      label: "Home",
      icon: "pi pi-fw pi-home",
      command: () => {
        router.push("/");
      },
    },
    {
      label: "Team",
      icon: "pi pi-fw pi-users",
      items: [
        {
          label: "Faculty Incharge",
          icon: "pi pi-fw pi-book",
          command: () => {
            router.push("/team/faculty-incharge");
          },
        },
        {
          label: "Our Team",
          icon: "pi pi-fw pi-users",
          command: () => {
            router.push("/team/our-team");
          },
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
          label: "Events",
          icon: "pi pi-fw pi-calendar",
          command: () => {
            router.push("/events");
          },
        },
        {
          label: "Events Calendar",
          icon: "pi pi-fw pi-calendar-times",
          command: () => {
            router.push("/events/event-calendar");
          },
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
            width={200}
            height={75}
            alt="ACM logo"
            onClick={() => {
              router.push("/");
            }}
          />
        }
        model={items}
      />
      <style jsx global>{`
        .nav {
          padding: 0 20px;
          border: none;
          border-bottom: 2px solid #e5e5e5;
          max-width: var(--max-width);
          width: 100%;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
        }
        .nav__acmLogo {
          width: 100% !important;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}

export default Navbar;
