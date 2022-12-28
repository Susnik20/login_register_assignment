const express = require("express")
const mongoose = require('mongoose')
const route = require("./routes/route.js")
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

mongoose.set('strictQuery', false);
mongoose.connect("mongodb+srv://anik2310:anik123@cluster0.tby9aun.mongodb.net/login",{
    useNewUrlParser: true
})
.then(()=>console.log("MongoDB is Connected"))
.catch(err => console.log(err))

app.use("/",route)

app.listen(process.env.PORT || 4000, ()=>{
    console.log(`Server is running on ${process.env.PORT || 4000}`)
})