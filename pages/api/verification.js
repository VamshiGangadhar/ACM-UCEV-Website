let crypto = require("crypto");
export default function handler(req, res) {
  let main = async () => {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      event_id,
      event_name,
      event_tags,
      participant_fullName,
      participant_email,
      participant_phone,
      participant_collageName,
      participant_class,
      participant_branch,
    } = JSON.parse(req.body);

    // CREATE DIGEST FROM THE PAYMENT DETAILS
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);
    const digest = shasum.digest("hex");

    // COMPARE THE DIGEST WITH THE SIGNATURE
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: "Transaction not legit!" });

    // IF EVERYTHING IS OKAY THEN WRITE THE DETAILS TO THE EXCEL FILE
    const createParticipantRes = await fetch(
      `${process.env.APPLICATION_URL}/api/create-participant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event_id,
          event_name: event_name,
          event_tags: event_tags,
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
    if (createParticipantRes.status === 200)
      res.status(200).json({
        msg: "success",
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      });
    else {
      console.error(createParticipantResData);
      res.status(500).json({
        msg:
          "Participant is not Created. please contact Event manager with this payment_id: " +
          razorpayPaymentId,
      });
    }
  };
  main();
}
