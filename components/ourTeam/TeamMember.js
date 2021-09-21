import React from "react";
import Image from "next/image";
import { Button } from "primereact/button";

function TeamMember({ memberName, memberPosition, memberPositionColor, memberImage, memberAbout, memberSocial }) {
  return (
    <>
      <div className="teamMember">
        <div className="teamMember__image">
          <Image src={memberImage[0].url} layout="fill" objectFit="contain" />
        </div>
        <div className="teamMember__info">
          <div className="teamMember__name">
            <h3>{memberName}</h3>
          </div>
          <div className="teamMember__position">
            <h3>{memberPosition}</h3>
          </div>
          <div className="teamMember__about">
            <p>{memberAbout}</p>
          </div>
          <div className="teamMember__socials">
            {memberSocial.map((social, index) => (
              <Button label={social.Name_of_social} icon="pi pi pi-link" className="p-button-secondary" />
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .teamMember {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 20px;
          background-color: #eeeeee;
          border-radius: 5px;
          border: 1px solid #cccccc;
        }
        .teamMember__image {
          border-radius: 12px;
          overflow: hidden;
        }
        .teamMember__info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .teamMember__name,
        .teamMember__position,
        .teamMember__about {
          text-align: center;
        }
        .teamMember__image {
          width: 150px;
          height: 150px;
          position: relative;
        }
        .teamMember__name {
          font-size: min(22px, 6.5vw);
        }
        .teamMember__position {
          margin: 0 auto;
          font-size: min(16px, 4.5vw);
          color: ${memberPositionColor};
          border: 2px solid ${memberPositionColor};
          padding: 5px 10px;
          border-radius: 100px;
        }
        .teamMember__about {
          line-height: 1.2;
          max-width: 300px;
          font-size: min(16px, 4.8vw);
        }
        .teamMember__socials {
          display: flex;
          flex-direction: row;
          gap: 10px;
          align-items: center;
          justify-content: center;
        }
        @media only screen and (max-width: 400px) {
          .teamMember {
            width: 90vw;
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
}

export default TeamMember;