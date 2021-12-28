const express = require('express');
const connectDB = require('./config/db')

const app = express();

//connect db
connectDB()

//Init Middleware
app.use(express.json())

app.get("/", (req, res)=>{
    console.log("getting server")
})

//Define routes
app.use('/api/users', require("./routes/api/users"))
app.use('/api/auth', require("./routes/api/auth"))
app.use('/api/profile', require("./routes/api/profile"))
app.use('/api/posts', require("./routes/api/posts"))


const PORT = process.env.PORT || 5001
app.listen(PORT, ()=>{console.log("Server running, ")})