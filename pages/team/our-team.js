import React from "react";
import Layout from "../../components/layout/Layout";
import Image from "next/image";
function ourTeam() {
  return (
    <>
      <Layout>
        <div className="ourTeam">
          <div className="ourTeam__hero">
            <div className="ourTeam__illustration">
              <Image src="/imgs/our-team.svg" alt="Our team" width={300} height={200} />
            </div>
            <div className="ourTeam__introduction">
              <h1 className="ourTeam__title">Our team</h1>
              <p className="ourTeam__description">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut dignissimos corporis sit perferendis
                obcaecati praesentium illo numquam, voluptatem omnis ea.
              </p>
            </div>
          </div>
        </div>
      </Layout>
      <style jsx>{`
        .ourTeam {
          max-width: 1200px;
          margin: 0 auto;
          padding: 50px 0;
          width: 100%;
        }
        .ourTeam__hero {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 20px;
          margin: 0 auto;
        }
        .ourTeam__title {
          font-size: min(30px, 8vw);
          margin-bottom: 20px;
        }
        .ourTeam__description {
          font-size: min(17px, 4.8vw);
          line-height: 1.5;
          max-width: 300px;
        }
        .ourTeam__illustration {
          height: 200px;
        }
      `}</style>
    </>
  );
}

export default ourTeam;
