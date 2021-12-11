import React from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import AboutACM from "../components/homePage/AboutACM";
import AboutChapter from "../components/homePage/AboutChapter";
import AboutJNTUV from "../components/homePage/AboutJNTUV";
import Hero from "../components/homePage/Hero";
import SubscribeNewsLetter from "../components/widgets/SubscribeNewsLetter";
import UpcommingEvents from "../components/homePage/UpcommingEvents";
import Layout from "../components/layout/Layout";
import LatestBlogPosts from "../components/homePage/LatestBlogPosts";

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      {
        homepageAlbum {
          photos {
            url
          }
        }
        posts(sort: "created_at:desc", limit: 5) {
          id
          Title
          Slug
          created_at
          updated_at
          Description
          authors {
            id
            Author_name
            Author_image {
              url
            }
          }
          tags {
            id
            Tag_name
          }
          Cover_image {
            url
          }
          Mini_description
        }
        events(sort: "Start_time:asc") {
          id
          created_at
          Event_name
          Start_time
          End_time
          Mini_description
          event_tags {
            Tag_name
          }
          Slug
        }
      }
    `,
  });
  return {
    props: {
      eventsOverview: data.events,
      postsOverview: data.posts,
      homepageAlbum: data.homepageAlbum,
      APPLICATION_URL: process.env.APPLICATION_URL,
    },
  };
};
function Home({
  eventsOverview,
  homepageAlbum,
  APPLICATION_URL,
  postsOverview,
}) {
  return (
    <>
      <Layout APPLICATION_URL={APPLICATION_URL}>
        <Hero />
        <div className="home__container">
          <AboutChapter photos={homepageAlbum} />
          <div className="home__about">
            <AboutACM />
            <AboutJNTUV />
          </div>
          <div className="home__map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15165.112094766891!2d83.36691852477446!3d18.151102102001676!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3bef0baf9f2a11%3A0xdb0b518115b27e07!2sJNTU%20Vizianagaram!5e0!3m2!1sen!2sin!4v1623559635361!5m2!1sen!2sin"
              width="100%"
              height="300"
              style={{ border: 0 }}
              loading="lazy"
            />
          </div>
          {eventsOverview.filter(
            (event) => Date.now() < new Date(event.Start_time)
          ).length != 0 && <UpcommingEvents events={eventsOverview} />}
          <SubscribeNewsLetter />
          <LatestBlogPosts data={postsOverview} />
        </div>
      </Layout>
      <style jsx>{`
        .home__about {
          display: flex;
          justify-content: space-evenly;
          max-width: 1200px;
          gap: 20px;
          margin: 30px auto;
        }
        .home__map {
          max-width: 1200px;
          margin: 20px auto;
        }
        .home__container {
          padding: 20px;
        }
        @media only screen and (max-width: 700px) {
          .home__about {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default Home;
