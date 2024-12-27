const prisma = require("../config/prisma");
const stripe = require("stripe")(
  "sk_test_51QZmrs06eBdgFcNHYxvpwOpruSiwUKN93msJBja0u9cWACh7fPPMBqBf2dSR626fePomhFxy0Q5gdM0ushc0VJWD008uIQNwQ6"
);

exports.payment = async (req, res) => {
  try {
    //code
    // Check user
    // req.user.id

    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: req.user.id,
      },
    });
    const amountTHB = cart.cartTotal * 100;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountTHB,
      currency: "thb",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
