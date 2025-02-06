require ('dotenv').config()

const express = require('express')
const cors = require('cors')
const db = require('./DB/connection.js')
const router = require('./Routers/router.js')

const productsServer = express()
const PORT = 3000 || process.env.PORT

productsServer.use(cors())
productsServer.use(express.json())
productsServer.use(router)
productsServer.use('/Uploads',express.static('./Uploads'))

productsServer.listen(PORT,()=>{
    console.log("productsServer running on port "+PORT)
})

productsServer.get('/',(req,res)=>{
    res.send("Welcome to productsServer")
})