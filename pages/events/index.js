import React, { useState, useEffect } from "react";
import { Message } from "primereact/message";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { SelectButton } from "primereact/selectbutton";
import { InputText } from "primereact/inputtext";
import Fuse from "fuse.js";
import Layout from "../../components/layout/Layout";
import EventResultCard from "../../components/eventsPage/EventResultCard";
import NoEventsFound from "../../components/eventsPage/NoEventsFound";

export const getStaticProps = async () => {
  const client = new ApolloClient({
    uri: process.env.BACKEND_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
  const { data } = await client.query({
    query: gql`
      {
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
  let updatedData = [];
  data.events.map((event) => {
    if (Date.now() < new Date(event.Start_time)) {
      updatedData.push({ ...event, event_status: { severity: "info", text: "upcoming" } });
    } else if (new Date(event.Start_time) <= Date.now() && Date.now() <= new Date(event.End_time)) {
      updatedData.push({ ...event, event_status: { severity: "warn", text: "ongoing" } });
    } else if (Date.now() > new Date(event.End_time)) {
      updatedData.push({ ...event, event_status: { severity: "error", text: "completed" } });
    }
  });
  return {
    props: {
      eventsOverview: updatedData,
    },
  };
};
function Events({ eventsOverview }) {
  const [referenceEventsOverview, setReferenceEventsOverview] = useState(eventsOverview);
  const [filterStatus, setFilterStatus] = useState(["upcoming", "ongoing"]);
  const [searchEntry, setSearchEntry] = useState("");
  const [results, setResults] = useState([]);

  let fuse = new Fuse(referenceEventsOverview, {
    keys: ["Event_name", "Mini_description", "event_tags.Tag_name", "event_status.text"],
  });

  useEffect(() => {
    let updatedEventsOverview = eventsOverview.filter((event) => {
      return filterStatus.includes(event.event_status.text.toLowerCase());
    });
    setReferenceEventsOverview(updatedEventsOverview);
    fuse = new Fuse(referenceEventsOverview, {
      keys: ["Event_name", "Mini_description", "event_tags.Tag_name", "event_status.text"],
    });
    let newResult = [];
    updatedEventsOverview.map((event) => {
      newResult.push({ item: event });
    });
    setResults(newResult);
  }, [filterStatus]);

  useEffect(() => {
    setFilterStatus(["upcoming", "ongoing"]);
  }, []);

  useEffect(() => {
    if (searchEntry.trim().length > 0) {
      setResults(fuse.search(searchEntry));
    } else {
      let newResult = [];
      referenceEventsOverview.map((event) => {
        newResult.push({ item: event });
      });
      setResults(newResult);
    }
  }, [searchEntry]);

  return (
    <>
      <Layout>
        <div className="events">
          <div className="events__left">
            <h1 className="events__upcomingTitle">Events</h1>
            {results.length != 0 ? (
              results?.map((event) => (
                <EventResultCard
                  key={event.item.Slug}
                  slug={event.item.Slug}
                  event_status={event.item.event_status}
                  event_name={event.item.Event_name}
                  event_tags={event.item.event_tags}
                  mini_description={event.item.Mini_description}
                  start_time={event.item.Start_time}
                  end_time={event.item.End_time}
                />
              ))
            ) : (
              //code
              <NoEventsFound
                filterStatus={filterStatus}
                searchEntry={searchEntry}
                setSearchEntry={setSearchEntry}
                setFilterStatus={setFilterStatus}
              />
            )}
          </div>
          <div className="events__right">
            <div className="events__filterSection">
              <div className="events__filterByStatus">
                <h1 className="events__filtersTitle">Filters</h1>
                <h3 className="events__filterStatusTitle">Filter by Status</h3>
                {filterStatus.length == 0 ? (
                  <Message
                    style={{ marginBottom: "10px" }}
                    severity="error"
                    text="Select at least one status to get results"
                  />
                ) : (
                  <></>
                )}
                <SelectButton
                  value={filterStatus}
                  options={[
                    { name: "Completed", value: "completed" },
                    { name: "Ongoing", value: "ongoing" },
                    { name: "Upcoming", value: "upcoming" },
                  ]}
                  onChange={(e) => setFilterStatus(e.value)}
                  optionLabel="name"
                  multiple
                />
              </div>
              <div className="events__filterBySearch">
                <h3 className="events__filterSearchTitle">Filter by Search</h3>
                {filterStatus.length != 0 && filterStatus.length != 3 ? (
                  <Message
                    className="events__filterSearchWarnMsg"
                    severity="warn"
                    text={`searching only events with status ${filterStatus.join(", ")}`}
                  />
                ) : (
                  <></>
                )}
                <span className="p-input-icon-left">
                  <i className="pi pi-search" />
                  <InputText
                    className="events__searchInput"
                    value={searchEntry}
                    onChange={(e) => setSearchEntry(e.target.value)}
                    placeholder="Search"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Layout>

      <style jsx global>{`
        .events {
          max-width: 1200px;
          margin: 20px auto;
          display: flex;
          justify-content: space-around;
          gap: 20px;
          padding: 20px;
        }
        .events__left {
          flex: 2;
        }
        .events__right {
          flex: 1;
        }
        .events__upcomingTitle,
        .events__filtersTitle {
          font-size: min(30px, 8vw);
          margin: 20px auto;
        }
        .events__filterStatusTitle,
        .events__filterSearchTitle {
          font-size: min(20px, 4.8vw);
          color: #444444;
          margin: 10px 0;
        }
        .events__filterSearchTitle {
          margin-top: 20px;
        }

        .events__filterSection {
          position: sticky;
          top: 20px;
          transform: translateX(0);
          max-height: 80vh;
        }
        .events__searchInput {
          width: min(310px, 90vw);
        }
        .events__filterSearchWarnMsg {
          width: min(310px, 90vw);
          border-bottom: 10px solid #fff !important;
        }
        @media only screen and (max-width: 800px) {
          .events {
            flex-direction: column;
            padding: 0;
          }
          .events__right {
            order: 0;
          }
          .events__left {
            order: 1;
          }
          .events__filterByStatus,
          .events__filtersTitle {
            display: none;
          }
          .events__searchInput {
            width: 90vw;
          }
          .events__filterSearchWarnMsg {
            width: 90vw;
            display: none;
          }
        }
      `}</style>
    </>
  );
}

export default Events;
