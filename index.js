const cors = require('cors')
const express = require('express')
const bordyparser = require('body-parser')
const controls = require('./DBUtils/controllers')
const app = express()
app.use(bordyparser.json())
app.use(cors())
app.post("/getall", (req, res)=>{
     controls.getAll(req, res)
})
app.post("/saveMeasurement", (req, res)=>{
    controls.saveMeasurement(req, res)
})
app.post("/tendUser", (req, res)=>{
    controls.tendUser(req, res)
})
app.post("/updateMeasurement", (req, res)=>{
    controls.saveMeasurement(req, res)
})
app.post("/signUp", (req, res)=>{
    controls.signUp(req, res)
})
app.post("/deleteUser", (req, res)=>{
    controls.deleteUser(req, res)
})
app.post("/createCustomer", (req, res)=>{
    controls.createCustomer(req, res)
})
app.post("/LogIN", (req, res)=>{
    controls.LogIn(req, res)
})
const portNumber = process.env.PORT || 8082
app.listen(portNumber,()=>{
    console.log(`listening at port ${portNumber}`)
})

