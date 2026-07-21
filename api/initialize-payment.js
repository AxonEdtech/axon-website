const axios = require("axios");

const COURSE_PRICES = {
  "Microsoft Word": 35000,
  "Microsoft Excel": 45000,
  "PowerPoint": 35000,
  "CorelDRAW": 55000,
  "Photoshop": 60000,
  "Desktop Publishing": 50000,
  "Secretariat Studies": 40000,
  "Data Analysis": 65000,
  "Ethical Hacking": 85000,
  "Cybersecurity": 70000,
  "Digital Marketing": 55000,
  "UI/UX Design": 75000,
  "Web Development": 80000,
  "Python Programming": 70000,
  "Data Science": 90000,
  "NYSC Registration": 15000,
  "JAMB Registration": 8000,
  "WAEC and NECO": 12000,
  "CAC Registration": 25000,
  "Type Setting": 10000,
  "Printing and Photocopy": 5000,
  "Printing Press": 30000,
  "Computer Repair": 15000,
  "Computer Sales": 0,
  "Graphic Design": 25000,
  "Letter Heading": 12000,
  "Passport Photograph": 3000,
  "Web3 and Smart Contract Systems": 40000
};

module.exports = async (req, res) => {

    if (req.method !== "POST") {
        return res.status(405).json({
            status: false,
            message: "Method Not Allowed"
        });
    }

    try {

        const {

            course,
            
            name,
            
            email,
            
            phone=""
            
            } = req.body;

        if (!course || !name || !email) {

            return res.status(400).json({

                status:false,

                message:"Missing required fields."

            });

        }

        const amount = COURSE_PRICES[course];

        if (!amount && amount !== 0) {

            return res.status(400).json({

                status:false,

                message:"Invalid course selected."

            });

        }

        const response = await axios.post(

            "https://api.paystack.co/transaction/initialize",

            {

                email,
            
                amount: amount * 100,
            
                currency: "NGN",
            
                callback_url: "https://axonedtech.com.ng/success.html",
            
                metadata:{
            
                    custom_fields:[
            
                        {
            
                            display_name:"Student Name",
            
                            variable_name:"student_name",
            
                            value:name
            
                        },
            
                        {
            
                            display_name:"Course",
            
                            variable_name:"course",
            
                            value:course
            
                        },
            
                        {
            
                            display_name:"Phone Number",
            
                            variable_name:"phone",
            
                            value:phone || ""
            
                        }
            
                    ]
            
                }
            
            },
            {

                headers:{

                    Authorization:`Bearer ${process.env.PAYSTACK_SECRET_KEY}`,

                    "Content-Type":"application/json"

                }

            }

        );

        return res.status(200).json(response.data);

    }

    catch(error){

        console.error(error.response?.data || error.message);

        return res.status(500).json({

            status:false,

            message:"Unable to initialize payment."

        });

    }

};