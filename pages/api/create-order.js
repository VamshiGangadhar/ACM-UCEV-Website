const Razorpay = require("razorpay");
export default function handler(req, res) {
  if (req.body) {
    try {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });
      // TODO: CHECK IF USER EMAIL IS IN ACM MEMBERSHIP THEN REDUCE THE PRICE
      async function createOrder() {
        const order = await instance.orders.create({
          amount: JSON.parse(req.body).amount,
          currency: "INR",
          receipt: JSON.parse(req.body).event_id,
          payment_capture: 1,
        });
        if (!order) return res.status(500).send("Some error occured");
        res.status(200).json(order);
      }
      createOrder();
    } catch (error) {
      res.status(500).send(error);
    }
  }
}
