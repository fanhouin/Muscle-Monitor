const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors');
dotenv.config()

//connect to mqtt_client
const mqtt_clinet = require('./routes/mqtt_client')

//import routes
const authRoute = require('./routes/auth')
const deviceRoute = require('./routes/device')
const muscleRoute = require('./routes/muscle')
const equipmentRoute = require('./routes/equipment')


mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('connected to db'))
    .catch(err => console.log(err))

//middleware
app.use(express.json())
app.use(cors({
    origin: ['http://localhost:8080'],
}))
//route middlewares
app.use(morgan('dev'))
app.use('/api/auth', authRoute)
app.use('/api/device', deviceRoute)
app.use('/api/muscle', muscleRoute)
app.use('/api/equipment', equipmentRoute)

app.listen(3000, () => console.log('Server is listening'))
