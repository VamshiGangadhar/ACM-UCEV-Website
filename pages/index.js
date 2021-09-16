import React from "react";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import AboutACM from "../components/AboutACM";
import AboutChapter from "../components/AboutChapter";
import AboutJNTUV from "../components/AboutJNTUV";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import SubscribeNewsLetter from "../components/SubscribeNewsLetter";
import UpcommingEvents from "../components/UpcommingEvents";

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
      homepageAlbum: data.homepageAlbum,
    },
  };
};
function Home({ eventsOverview, homepageAlbum }) {
  return (
    <>
      <Navbar />
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
        <UpcommingEvents events={eventsOverview} />
        <SubscribeNewsLetter />
      </div>
      <Footer />
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
        @media only screen and (max-width: 400px) {
          .home__about {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}

export default Home;
