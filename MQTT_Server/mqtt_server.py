import threading
import socket
import json
import AWSIoTPythonSDK.MQTTLib as AWSIoTPyMQTT


HOST = '0.0.0.0'
# [TODO] 166XX, XX is your tool box number
PORT = 16169

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM) #TCP
s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
s.bind((HOST, PORT))
s.listen(5)
tSocket=[]

# [HINT] currentRing stores the ring state
currentRing = None
# [HINT] Lock maintain the indentity of resource
Lock = threading.Lock()
# [HINT] variable for socket
conn, addr = None,None


def mqttcallback(client, userdata, message):
    global currentRing,conn,addr,Lock
    try:
        # [TODO] write callback to deal with MQTT message from Lambda
        msg = json.loads(message.payload)
        
        if "desired" in msg["state"]:
            print("msg recv: " + str(msg))
            send_string = "ring: " +  str(msg["state"]["desired"]["ring"])
            print("send: " + send_string)
            send_string = send_string.encode('utf-8')
            print("send_hex: " + str(send_string))
            conn.send(send_string)
    except Exception as e:
        print(e)



# # [TODO] Define ENDPOINT, CLIENT_ID, PATH_TO_CERT, PATH_TO_KEY, PATH_TO_ROOT
# ENDPOINT = "a3vxe6kv2l8z0g-ats.iot.us-east-2.amazonaws.com"
# CLIENT_ID = "Lab3"
# PATH_TO_ROOT = "./CA.txt"
# PATH_TO_KEY = "./e44e56a37e-private.pem.key"
# PATH_TO_CERT = "./e44e56a37e-certificate.pem.crt"


# myAWSIoTMQTTClient = AWSIoTPyMQTT.AWSIoTMQTTClient(CLIENT_ID)
# myAWSIoTMQTTClient.configureEndpoint(ENDPOINT, 8883)
# myAWSIoTMQTTClient.configureCredentials(PATH_TO_ROOT, PATH_TO_KEY, PATH_TO_CERT)

# myAWSIoTMQTTClient.connect()
# # [TODO] subscribe AWS topic(s)
# myAWSIoTMQTTClient.subscribe('$aws/things/Lab3/shadow/update',0,mqttcallback)



def on_new_client(clientsocket,addr):
    global currentRing
    while True:
        # [TODO] decode message from Arduino and send to AWS
        receive = clientsocket.recv(20).decode('utf-8')
        print("recv: " + receive)
        conn.send("0".encode('utf-8'))
        # receive = receive.split(',')
        # payload = {
        #     "state":{
        #         "reported":{
        #             "humidity":float(receive[0]),
        #             "ring":float(receive[1])
        #         }
        #     }  
	    # }
        # myAWSIoTMQTTClient.publish("$aws/things/Lab3/shadow/update",json.dumps(payload),1)
    clientsocket.close()


print('server start at: %s:%s' % (HOST, PORT))
print('wait for connection...')

def main():
    global conn, addr
    try:
        conn, addr = s.accept()
        print('connected by ' + str(addr))
        t = threading.Thread(target=on_new_client,args=(conn,addr))
        tSocket.append(t)
        tSocket[-1].start()
    except Exception as e:
        print(e)
        s.close()
        print("socket close")

if __name__ == '__main__':
    main()