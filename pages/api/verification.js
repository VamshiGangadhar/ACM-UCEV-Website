let crypto = require("crypto");
export default function handler(req, res) {
  // getting the details back from our font-end
  const {
    orderCreationId,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
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
  //TODO: write to excel file

  // THE PAYMENT IS LEGIT & VERIFIED
  // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
  res.status(200).json({
    msg: "success",
    orderId: razorpayOrderId,
    paymentId: razorpayPaymentId,
  });
}
