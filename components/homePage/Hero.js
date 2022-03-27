import React from "react";
import { Button } from "primereact/button";
import { useRouter } from "next/router";

function Hero() {
  const router = useRouter();
  return (
    <div className="hero__container">
      <div className="hero">
        <div className="hero__left">
          <div className="hero__text">
            <h1>
              Gaining <span className="hero__hiSkills">skills</span> by learning{" "}
              <span className="hero__hiTogether">together</span> with fun
            </h1>
            <p>
              JNTUK UCEV ACM Chapter enables students to learn and grow in
              various fields of Computer Science and Engineering by conducting
              events, workshops and competitions.
            </p>
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
        <div className="hero__right">
          <img src="/imgs/hero.svg" alt="hero" />
        </div>
      </div>

      <style jsx global>{`
        .hero__container {
          background-color: #eeeeee;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='%23d8d8d8' fill-opacity='0.4'%3E%3Cpath fill-rule='evenodd' d='M11 0l5 20H6l5-20zm42 31a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM0 72h40v4H0v-4zm0-8h31v4H0v-4zm20-16h20v4H20v-4zM0 56h40v4H0v-4zm63-25a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM53 41a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-30 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-28-8a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zM56 5a5 5 0 0 0-10 0h10zm10 0a5 5 0 0 1-10 0h10zm-3 46a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm10 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM21 0l5 20H16l5-20zm43 64v-4h-4v4h-4v4h4v4h4v-4h4v-4h-4zM36 13h4v4h-4v-4zm4 4h4v4h-4v-4zm-4 4h4v4h-4v-4zm8-8h4v4h-4v-4z'/%3E%3C/g%3E%3C/svg%3E");
        }
        .hero {
          min-height: 40vh;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 10vh 30px;
          max-width: 1200px;
          margin: 0 auto;
        }
        .hero__text {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .hero__left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .hero__right {
          display: flex;
          justify-content: center;
        }
        .hero__text h1 {
          color: #3f3d56;
          font-size: var(--font-size-xl);
        }
        .hero__hiSkills {
          display: inline-block;
          color: #ff6584;
          border-bottom: 3px dashed #ff6584;
        }
        .hero__hiTogether {
          display: inline-block;
          color: #c0ab35;
          border-bottom: 3px dashed #c0ab35;
        }
        .hero__text p {
          line-height: 1.5;
        }
        .hero__actionBtns {
          display: flex;
          gap: 20px;
        }
        .hero__actionBtn {
          background-color: #3792c1;
          color: #fff;
          border: none;
        }
        .hero__actionBtn:hover {
          background-color: #2b789e !important;
        }
        .hero__right img {
          width: min(80%, 350px);
        }
        @media only screen and (max-width: 700px) {
          .hero {
            flex-direction: column-reverse;
          }
        }
      `}</style>
    </div>
  );
}

export default Hero;
