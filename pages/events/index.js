import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import { Message } from "primereact/message";
import { format } from "date-fns";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Chip } from "primereact/chip";
import { useRouter } from "next/router";
import Fuse from "fuse.js";

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
  const router = useRouter();
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
                <div key={event.item.Slug} className="events__event">
                  <Message severity={event.item.event_status.severity} text={event.item.event_status.text} />
                  <h2 className="events__eventTitle">{event.item.Event_name}</h2>
                  {event.item.event_tags.map((tag, index) => (
                    <Chip className="events__cardChip" key={index} label={tag.Tag_name} />
                  ))}
                  <p className="events__miniDescription">{event.item.Mini_description}</p>
                  <p className="events__eventTimings">
                    <span className="events__startTime">
                      {format(new Date(event.item.Start_time), "do MMM yyyy HH:mm bbb")}
                    </span>
                    <i className="pi pi-arrow-circle-right" />
                    <span className="events__endTime">
                      {format(new Date(event.item.End_time), "do MMM yyyy HH:mm bbb")}
                    </span>
                  </p>
                  <Button
                    label="Read more"
                    icon="pi pi-arrow-circle-right"
                    onClick={() => {
                      router.push(`/events/${event.item.Slug}`);
                    }}
                  ></Button>
                </div>
              ))
            ) : (
              <div className="events__noResults">
                <img className="events__noResultsimg" src="/imgs/results-not-found.svg" alt="upcoming events" />
                <div className="events_noResultsContent">
                  <h2 className="events__noResultsTitle">No results found</h2>
                  {filterStatus.length != 0 ? (
                    <>
                      <p className="events__noResultsDesc">
                        No results found for &quot;{searchEntry}&quot;. Try a different search or cancel the search
                        below.
                      </p>
                      <Button
                        label="Cancel Search"
                        className="events__noResultsCancel"
                        onClick={() => setSearchEntry("")}
                      />
                    </>
                  ) : (
                    <>
                      <p className="events__noResultsDesc">
                        You need to select at least one event status to filter the results. Try selecting more statuses
                        or click the button below to reset filters
                      </p>
                      <Button
                        label="Reset Filters"
                        className="events__noResultsCancel"
                        onClick={() => setFilterStatus(["upcoming", "ongoing", "completed"])}
                      />
                    </>
                  )}
                </div>
              </div>
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
                    { name: "Upcoming", value: "upcoming" },
                    { name: "Ongoing", value: "ongoing" },
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
          padding: 20px;
          gap: 20px;
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
          margin: 20px 0;
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
        .events__cardChip {
          margin-bottom: 10px;
        }
        .events__eventTimings {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        .events__startTime,
        .events__endTime {
          border: 1px solid #c4c4c4;
          padding: 5px;
          border-radius: 3px;
          background-color: #ddd;
          font-size: min(14px, 4vw);
          color: #444444;
          display: block;
        }
        .events__noResults {
          display: flex;
          align-items: center;
          gap: 20px;
          border: 1px solid #ddd;
          padding: 20px;
          border-radius: 6px;
          max-width: min(100%, 700px);
          background-color: #eeeeee;
        }
        .events__noResultsTitle {
          font-size: min(30px, 8vw);
          color: #444444;
          margin-bottom: 20px;
        }
        .events__noResultsDesc {
          max-width: 100%;
          line-height: 1.5;
          word-wrap: break-word;
        }
        .events__noResultsCancel {
          margin-top: 20px;
        }
        .events__noResultsimg {
          max-width: min(300px, 70vw);
          display: block;
          margin: 0 auto;
        }
        .events__event {
          background-color: #eeeeee;
          border-radius: 6px;
          border: 1px solid #cccccc;
          padding: 20px;
          max-width: min(100%, 700px);
          white-space: break-word;
          overflow: hidden;
          margin-bottom: 20px;
        }
        .events__eventTitle {
          font-size: min(20px, 6vw);
          color: #333333;
          margin: 10px 0;
        }
        .events__miniDescription {
          font-size: min(16px, 4.8vw);
          margin-bottom: 10px;
          line-height: 1.5;
          color: #222222;
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
          }
          .events__right {
            order: 0;
          }
          .events__left {
            order: 1;
          }
          .events__event {
            width: 90vw;
            margin: 10px auto;
          }
          .events__noResults {
            flex-direction: column;
          }
          .events_noResultsContent {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            max-width: 400px;
            text-align: center;
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
