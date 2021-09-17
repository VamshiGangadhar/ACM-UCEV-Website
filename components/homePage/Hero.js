import React from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";

function Hero() {
  const router = useRouter();
  return (
    <>
      <div className="hero">
        <div className="hero__text">
          <h1>JNTUK UCEV ACM Student chapter</h1>
        </div>
        <div className="hero__actionBtns">
          <Button
            className="hero__actionBtn"
            label="Join Us"
            icon="pi pi-user-plus"
            tooltip="Join our ACM Chapter"
            tooltipOptions={{ position: "bottom" }}
          />
          <Button
            className="hero__actionBtn"
            label="Events"
            icon="pi pi-calendar"
            tooltip="Browse through events"
            tooltipOptions={{ position: "bottom" }}
            onClick={() => {
              router.push(`/events`);
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        .hero {
          min-height: 40vh;
          display: flex;
          flex-direction: column;
          gap: 20px;
          justify-content: center;
          align-items: center;
          padding: 30px;
        }
        .hero__text {
          color: #ffffff;
          font-size: min(35px, 8vw);
          text-align: center;
        }
        .hero__actionBtns {
          display: flex;
          gap: 20px;
        }
        .hero__actionBtn {
          background-color: #ffffff;
          color: #3792c1;
          border: none;
        }
        .hero__actionBtn:hover {
          background-color: #eeeeee !important;
          color: #3792c1 !important;
        }
      `}</style>
    </>
  );
}

export default Hero;
