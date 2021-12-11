import React from "react";
import Layout from "../../components/layout/Layout";
import Image from "next/image";
import TeamMember from "../../components/ourTeam/TeamMember";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      {
        ourTeams {
          Member_name
          Member_position
          Member_image {
            url
          }
          About_member
          Social_links {
            Name_of_social
            Social_url
          }
        }
      }
    `,
  });
  return {
    props: {
      teamMembers: data.ourTeams,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};
function ourTeam({ teamMembers, APPLICATION_URL }) {
  const paleColors = [
    "#0EA47A",
    "#CD5D7D",
    "#3D6271",
    "#0C81F6",
    "#506E86",
    "#FAB95B",
    "#F05454",
  ];
  return (
    <>
      <Layout
        metaTitle="ACM UCEV Team"
        metaDescription="Team at JNTUK UCEV ACM Student's chapter"
        APPLICATION_URL={APPLICATION_URL}
      >
        <div className="ourTeam">
          <div className="ourTeam__hero">
            <div className="ourTeam__illustration">
              <Image
                src="/imgs/our-team.svg"
                alt="Our team"
                width={300}
                height={200}
              />
            </div>
            <div className="ourTeam__introduction">
              <h1 className="ourTeam__title">Our team</h1>
              <p className="ourTeam__description">
                We are a group of students from JNTUK UCEV who are passionate
                about technology and computer science. Know more about us in
                this page.
              </p>
            </div>
          </div>
          <div className="ourTeam__allMembers">
            {teamMembers.map((member, index) => {
              return (
                <TeamMember
                  key={index}
                  memberPositionColor={
                    paleColors[
                      index <= paleColors.length
                        ? index
                        : index % paleColors.length
                    ]
                  }
                  memberName={member.Member_name}
                  memberPosition={member.Member_position}
                  memberImage={member.Member_image}
                  memberAbout={member.About_member}
                  memberSocial={member.Social_links}
                />
              );
            })}
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
          flex-wrap: wrap;
          padding: 20px;
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
        .ourTeam__allMembers {
          margin: 50px auto;
          max-width: 1000px;
          overflow: hidden;
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-gap: 30px;
        }
        @media only screen and (max-width: 400px) {
          .ourTeam__allMembers {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
      `}</style>
    </>
  );
}

export default ourTeam;
