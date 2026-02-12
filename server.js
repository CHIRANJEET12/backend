require("dotenv").config()

const app = require("./src/app")
const connectedb = require("./src/config/db")

connectedb()

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})