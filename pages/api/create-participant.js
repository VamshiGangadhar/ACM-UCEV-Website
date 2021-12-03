const { google } = require("googleapis");

export default function handler(req, res) {
  function main() {
    try {
      // GET THE AUTH CLIENT TO USE FOR GOOGLE SHEETS API CALLS WITH PRIVATE KEY FROM ENV
      // ENV FILE CONTAINS THE PRIVATE KEY WITH \n ENCODED SO WE NEED TO REPLACE WITH ACTUAL \n
      console.info("Getting auth client...");
      let jwtClient = new google.auth.JWT(
        process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        null,
        (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/spreadsheets"]
      );

      // AUTHENTICATE WITH GOOGLE SHEETS API
      console.info("Authenticating with Google Sheets API...");
      jwtClient.authorize(function (err, tokens) {
        if (err) {
          console.error("something went wrong: " + err);
          return;
        } else {
          console.log("Sheets API Successfully connected!");
        }
      });

      // CREATE A SHEET WITH FORMATTED FIRST ROW WITH LABELS (NOT CALLING IT YET)
      let createSheet = async (count) => {
        // CREATE A SHEET TO STORE THE PARTICIPANT DATA
        console.info("Creating a sheet to store the participant data...");
        let newSheetRes = await google.sheets("v4").spreadsheets.batchUpdate(
          {
            auth: jwtClient,
            spreadsheetId: process.env.SPREADSHEET_ID,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: `${
                        typeof req.body.order_id !== "undefined" ? "💰" : "🆓"
                      } ${req.body.event_name}`,
                    },
                  },
                },
              ],
            },
          },
          (err, response) => {
            // ###################### 1st Callback ######################
            if (err)
              res.status(500).send({ msg: "CREATE NEW SHEET ERROR: " + err });

            // GET THE ID OF THE NEW SHEET
            let newSheetId =
              response.data.replies[0].addSheet.properties.sheetId;

            // WRITE FIRST ROW OF THE SHEET WITH LABELS
            console.info("Writing the first row of the sheet...");
            google.sheets("v4").spreadsheets.values.append(
              {
                auth: jwtClient,
                spreadsheetId: process.env.SPREADSHEET_ID,
                range: `${
                  typeof req.body.order_id !== "undefined" ? "💰" : "🆓"
                } ${req.body.event_name}`,
                valueInputOption: "RAW",
                insertDataOption: "INSERT_ROWS",
                resource: {
                  values: [
                    [
                      "Date Added",
                      "Full Name",
                      "Email Address",
                      "Phone Number",
                      "Collage Name",
                      "Class",
                      "Branch",
                      typeof req.body.order_id !== "undefined"
                        ? "Order ID"
                        : "",
                      typeof req.body.payment_id !== "undefined"
                        ? "Payment ID"
                        : "",
                    ],
                  ],
                },
              },
              (err) => {
                // ################### 2rd Callback ###################
                if (err)
                  res
                    .status(500)
                    .send({ msg: "APPEND NEW SHEET LABELS ERROR: " + err });

                // FREEZE AND FORMAT THE FIRST ROW OF NEWLY CREATED SHEET
                console.info(
                  "Freezing and formatting the first row of the sheet..."
                );
                google.sheets("v4").spreadsheets.batchUpdate(
                  {
                    auth: jwtClient,
                    spreadsheetId: process.env.SPREADSHEET_ID,
                    requestBody: {
                      requests: [
                        {
                          updateSheetProperties: {
                            fields: "gridProperties.frozenRowCount",
                            properties: {
                              sheetId: newSheetId,
                              gridProperties: {
                                frozenRowCount: 1,
                              },
                            },
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: newSheetId,
                              endRowIndex: 1,
                            },
                            cell: {
                              userEnteredFormat: {
                                backgroundColor: {
                                  red: 55 / 255,
                                  green: 146 / 255,
                                  blue: 193 / 255,
                                },
                                horizontalAlignment: "CENTER",
                                verticalAlignment: "MIDDLE",
                                textFormat: {
                                  foregroundColor: {
                                    red: 1.0,
                                    green: 1.0,
                                    blue: 1.0,
                                  },
                                  fontSize: 12,
                                  bold: true,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
                          },
                        },
                        {
                          updateDimensionProperties: {
                            range: {
                              sheetId: newSheetId,
                              dimension: "ROWS",
                              startIndex: 0,
                              endIndex: 1,
                            },
                            properties: {
                              pixelSize: 40,
                            },
                            fields: "pixelSize",
                          },
                        },
                        {
                          updateDimensionProperties: {
                            range: {
                              sheetId: newSheetId,
                              dimension: "COLUMNS",
                              startIndex: 0,
                              endIndex:
                                typeof req.body.order_id !== "undefined"
                                  ? 9
                                  : 7,
                            },
                            properties: {
                              pixelSize: 200,
                            },
                            fields: "pixelSize",
                          },
                        },
                      ],
                    },
                  },
                  (err) => {
                    // ###################### 3nd Callback ######################
                    if (err)
                      res.status(500).send({
                        msg: "FORMATTING 1st ROW OF NEW SHEET ERROR: " + err,
                      });

                    // ADD THE PARTICIPANT TO THE SHEET AGAIN
                    console.info(
                      "Adding the participant to the sheet again..."
                    );
                    addParticipantsToSheet(count + 1, newSheetId);
                  }
                );
              }
            );
          }
        );
      };

      // ADD PARTICIPANTS TO SHEET FUNCTION (NOT CALLING IT YET)
      // COUNT IS USED TO TRY AGAIN IF SHEET DOESN'T EXIST AND TO PREVENT AN INFINITE LOOP
      let addParticipantsToSheet = (count, newSheetId) => {
        console.info("Adding participants to the sheet...");
        // get a new date (locale machine date time)
        // get the date as a string
        // get the time as a string
        var date = new Date();
        var time = date.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        google.sheets("v4").spreadsheets.values.append(
          {
            auth: jwtClient,
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: `${typeof req.body.order_id !== "undefined" ? "💰" : "🆓"} ${
              req.body.event_name
            }`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            resource: {
              values: [
                [
                  time,
                  req.body.participant_fullName,
                  req.body.participant_email,
                  req.body.participant_phone,
                  req.body.participant_collageName,
                  req.body.participant_class,
                  req.body.participant_branch,
                  typeof req.body.order_id !== "undefined"
                    ? req.body.order_id
                    : "",
                  typeof req.body.payment_id !== "undefined"
                    ? req.body.payment_id
                    : "",
                ],
              ],
            },
          },
          (err) => {
            if (err) {
              if (
                (err ==
                  "Error: Unable to parse range: " +
                    typeof req.body.order_id) !==
                "undefined"
                  ? "💰 "
                  : "🆓 " + req.body.event_name && count < 3
              ) {
                // CREATE THE SHEET IF IT DOESN'T EXIST
                console.info("Sheet not found, creating one");
                createSheet(count);
              } else {
                console.error("ERROR creating participant: " + err);
                res
                  .status(500)
                  .send({ msg: "ERROR creating participant: " + err });
              }
            } else {
              console.log("Successfully added new participant!");

              if (newSheetId) {
                // CLEARING STYLES FROM HEADER ROW OF THE NEW SHEET
                console.info("Clearing styles from header row of the sheet...");
                google.sheets("v4").spreadsheets.batchUpdate(
                  {
                    auth: jwtClient,
                    spreadsheetId: process.env.SPREADSHEET_ID,
                    requestBody: {
                      requests: [
                        {
                          updateSheetProperties: {
                            fields: "gridProperties.frozenRowCount",
                            properties: {
                              sheetId: newSheetId,
                              gridProperties: {
                                frozenRowCount: 1,
                              },
                            },
                          },
                        },
                        {
                          repeatCell: {
                            range: {
                              sheetId: newSheetId,
                              startRowIndex: 1,
                              endRowIndex: 1000,
                            },
                            cell: {
                              userEnteredFormat: {
                                backgroundColor: {
                                  red: 1,
                                  green: 1,
                                  blue: 1,
                                },
                                horizontalAlignment: "LEFT",
                                verticalAlignment: "MIDDLE",
                                textFormat: {
                                  foregroundColor: {
                                    red: 0,
                                    green: 0,
                                    blue: 0,
                                  },
                                  fontSize: 12,
                                  bold: false,
                                },
                              },
                            },
                            fields:
                              "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)",
                          },
                        },
                        {
                          updateDimensionProperties: {
                            range: {
                              sheetId: newSheetId,
                              dimension: "ROWS",
                              startIndex: 1,
                              endIndex: 1000,
                            },
                            properties: {
                              pixelSize: 30,
                            },
                            fields: "pixelSize",
                          },
                        },
                      ],
                    },
                  },
                  (err) => {
                    if (err)
                      res.status(500).send("ERROR clearing styles: " + err);
                    else
                      console.info(
                        "Successfully cleared styles from header row!"
                      );
                    res
                      .status(200)
                      .send({ msg: "Successfully added participant!" });
                  }
                );
              } else
                res
                  .status(200)
                  .send({ msg: "Successfully added participant!" });
            }
          }
        );
      };

      // ADD PARTICIPANT TO GOOGLE SHEETS (COUNT is 0 initially)
      addParticipantsToSheet(0);
    } catch (err) {
      console.log(err);
      // SEND RESPONSE TO THE CLIENT
      res.status(500).send({
        status: "error",
        message: "Something went wrong " + err,
      });
    }
  }

  main();
}
