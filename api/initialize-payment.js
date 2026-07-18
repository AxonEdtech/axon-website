const axios = require("axios");

module.exports = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).json({
            message: "Method Not Allowed"
        });
    }

    const { email, amount, course } = req.body;

    try {

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount,
                metadata: {
                    course
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return res.status(200).json(response.data);

    } catch (error) {

        console.log(error.response?.data || error.message);

        return res.status(500).json({
            message: "Payment initialization failed."
        });

    }

};