const axios = require("axios");

module.exports = async (req, res) => {

    if (req.method !== "GET") {
        return res.status(405).json({
            status: false,
            message: "Method Not Allowed"
        });
    }

    try {

        const { reference } = req.query;

        if (!reference) {
            return res.status(400).json({
                status: false,
                message: "Transaction reference is required."
            });
        }

        const response = await axios.get(

            `https://api.paystack.co/transaction/verify/${reference}`,

            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }

        );

        return res.status(200).json(response.data);

    }

    catch(error){

        console.error(error.response?.data || error.message);

        return res.status(500).json({

            status:false,

            message:"Unable to verify payment."

        });

    }

};