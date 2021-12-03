let crypto = require("crypto");
export default function handler(req, res) {
  function main() {
    try {
      // getting the details back from our font-end
      const {
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        event_name,
        event_id,
        participant_fullName,
        participant_email,
        participant_phone,
        participant_collageName,
        participant_class,
        participant_branch,
      } = JSON.parse(req.body);

      console.table({
        orderCreationId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        event_name,
        event_id,
        participant_fullName,
        participant_email,
        participant_phone,
        participant_collageName,
        participant_class,
        participant_branch,
      });
      // CREATE DIGEST FROM THE PAYMENT DETAILS
      // The format should be like this:
      // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);

      console.info("Creating digest from payment details...");
      const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
      shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
      const digest = shasum.digest("hex");

      // COMPARE THE DIGEST WITH THE SIGNATURE
      console.info("Comparing digest with signature...");
      if (digest !== razorpaySignature) {
        console.error("Signature does not match digest!");
        return res.status(400).json({
          msg:
            "Transaction not legit. please contact Event manager with this payment_id: " +
            razorpayPaymentId,
        });
      }
      console.info("Signature matches digest!");

      // IF EVERYTHING IS OKAY THEN WRITE THE DETAILS TO THE EXCEL FILE
      console.info("Writing payment details to excel file...");
      async function createParticipant() {
        const createParticipantRes = await fetch(
          `${process.env.APPLICATION_URL}/api/create-participant`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event_id,
              event_name,
              participant_fullName,
              participant_email,
              participant_phone,
              participant_collageName,
              participant_class,
              participant_branch,
              order_id: razorpayOrderId,
              payment_id: razorpayPaymentId,
            }),
          }
        );
        const createParticipantResData = await createParticipantRes.json();

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        if (createParticipantRes.status === 200) {
          console.info(
            "[SUCCESS] Response from create-participant: " +
              createParticipantResData.msg
          );
          res.status(200).json({
            msg: "Payment verified successfully! Registration Completed",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
          });
        } else {
          console.error(
            "[ERROR] Response from create-participant: " +
              createParticipantResData.msg
          );
          res.status(500).json({
            msg:
              "Participant is not Created. please contact Event manager with this payment_id: " +
              razorpayPaymentId,
          });
        }
      }
      createParticipant();
    } catch (err) {
      console.error("Something went wrong " + err);
      // SEND RESPONSE TO THE CLIENT
      res.status(500).send({
        status: "error",
        message: "Something went wrong " + err,
      });
    }
  }

  main();
}
