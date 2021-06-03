const net = require('net')
const client = new net.Socket()

client.connect({port:16169},()=>{
    console.log('connected mqtt server')
})

module.exports = client

// client.on('connect',()=>{
//     client.write('i am client')
// })