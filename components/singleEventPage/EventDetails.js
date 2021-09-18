import React, { useState } from "react";
import { format } from "date-fns";
import { Chip } from "primereact/chip";
import { Message } from "primereact/message";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

function EventDetails({
  event_status,
  event_name,
  event_description,
  event_tags,
  start_time,
  isValid,
  end_time,
  registerPrice,
}) {
  const [showCalendarDialog, setShowCalendarDialog] = useState(false);
  const handleCalendarProviderClick = (provider) => {
    if (showCalendarDialog) {
      let url = `https://calndr.link/d/event/?service=${provider}&start=${format(
        new Date(start_time),
        "yyyy'-'MM'-'dd p"
      )}&end=${format(new Date(end_time), "yyyy'-'MM'-'dd p")}&title=${event_name}&description=${event_description}`;
      window.open(url, "_blank");
    }
    setShowCalendarDialog(false);
  };
  return (
    <>
      <div className="eventDetails">
        <div className="eventDetails_titleWrapper">
          <h1 className="eventDetails_title">Event Details</h1>
          <Message severity={event_status.severity} text={event_status.text} />
        </div>
        <ul>
          <li>
            <b>
              <i className="pi pi-info-circle" /> Event Name:
            </b>
            <br />
            <p>{event_name}</p>
          </li>
          <li>
            <b>
              <i className="pi pi-question-circle" /> Event Type:
            </b>
            <br />
            {event_tags?.map((tag, index) => (
              <Chip className="eventDetails_eventType" key={index} label={tag.Tag_name} />
            ))}
          </li>
          <li>
            <b>
              <i className="pi pi-calendar-plus" /> Start Time:
            </b>
            <br />
            {format(new Date(start_time), "do MMM yyyy HH:mm bbb")}
          </li>
          <li>
            <b>
              <i className="pi pi-calendar-times" /> End Time:
            </b>
            <br />
            {format(new Date(end_time), "do MMM yyyy HH:mm bbb")}
          </li>
          <li>
            <b>
              <i className="pi pi-chevron-circle-up" /> Registration Price:
            </b>
            <br />
            {registerPrice}
          </li>
        </ul>
        {isValid && (
          <Button
            label="Save to your Calendar"
            icon="pi pi-calendar"
            onClick={() => setShowCalendarDialog(true)}
            tooltip="opens dialog to select your calendar provider"
            tooltipOptions={{ position: "bottom" }}
          />
        )}
        <Dialog
          header="Select Calendar to Save"
          visible={showCalendarDialog}
          style={{ width: "min(350px, 90vw)" }}
          onHide={() => setShowCalendarDialog(false)}
        >
          <div className="eventDetails_selectCalBtns">
            <Button label="Google Calendar" icon="pi pi-google" onClick={() => handleCalendarProviderClick("google")} />
            <Button label="Apple Calendar" icon="pi pi-apple" onClick={() => handleCalendarProviderClick("apple")} />
            <Button
              label="Outlook Calendar"
              icon="pi pi-microsoft"
              onClick={() => handleCalendarProviderClick("outlookcom")}
            />
          </div>
        </Dialog>
      </div>

      <style jsx>{`
        .eventDetails_selectCalBtns {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .eventDetails {
          padding: 20px;
          border: 1px solid #dadada;
          border-radius: 6px;
          position: sticky;
          top: 20px;
          transform: translateX(0);
          max-height: 80vh;
        }
        .eventDetails_titleWrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .eventDetails_title {
          font-size: 20px;
          color: #3792c1;
        }
        .eventDetails ul {
          padding: 0;
          list-style-type: none;
          margin-bottom: 10px;
        }
        .eventDetails li {
          color: #444444;
          background-color: #eeeeee;
          padding: 10px;
          margin-top: 10px;
          border-radius: 6px;
        }
        .eventDetails ul > li > b {
          padding-bottom: 5px;
          display: inline-block;
          color: #333333;
        }
        .eventDetails_eventType {
          font-size: min(14px, 3vw);
        }
      `}</style>
    </>
  );
}

export default EventDetails;
