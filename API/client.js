const net = require('net')
const client = new net.Socket()
let state = 0;

client.connect({port:16169},()=>{
    console.log('connected mqtt server')
    client.write('mac_id@@@@1')
})

client.on("data", data => {
    let recv = data.toString("utf8")
    console.log(recv)
    if(recv == 'get_mac') state = 1
    if(recv == 'send') state = 3
    if(state == 1){
        client.write('device@@@@1')
        state = 2
    }
    if(state == 3){
        console.log('hi')
    }
})


