const mongoose = require('mongoose')

const connectionString = process.env.connectionString

mongoose.connect(connectionString)
.then(res=>{
    console.log("productsServer connected with MongoDB")
})
.catch(err=>{
    console.log(err)
})