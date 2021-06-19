import threading
import socket
import json
import AWSIoTPythonSDK.MQTTLib as AWSIoTPyMQTT
import ssl
ssl._create_default_https_context = ssl._create_unverified_context

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
connPool = {}
userPool = {}


#Define ENDPOINT, CLIENT_ID, PATH_TO_CERT, PATH_TO_KEY, PATH_TO_ROOT
ENDPOINT = "a3vxe6kv2l8z0g-ats.iot.us-east-2.amazonaws.com"
CLIENT_ID = "muscle_1"
PATH_TO_ROOT = "./CA.txt"
PATH_TO_KEY = "./b9b91a2ed9-private.pem.key"
PATH_TO_CERT = "./b9b91a2ed9-certificate.pem.crt"


myAWSIoTMQTTClient = AWSIoTPyMQTT.AWSIoTMQTTClient(CLIENT_ID)
myAWSIoTMQTTClient.configureEndpoint(ENDPOINT, 8883)
myAWSIoTMQTTClient.configureCredentials(PATH_TO_ROOT, PATH_TO_KEY, PATH_TO_CERT)

myAWSIoTMQTTClient.connect()


def on_new_client(clientsocket,addr):
    global currentRing, connPool
    while True:
        receive = clientsocket.recv(1024).decode('utf-8')
        datas = receive.split('@@@@')
        #send the message to the real device
        # (this situation is for api server)
        if datas[0] == 'app':
            data = json.loads(datas[1])
            print(data)
            try:
                sendclient = connPool[data['mac']]
                userPool[data['mac']] = data['user_id'] #save the mac-user_id in hashmap
                sendclient.send((data['info'] + '\n').encode('utf8'))
            except:
                print("Not Find device")
            
        #when the device connect, 
        #need to know the mac and push it's conn to connpool
        elif datas[0] == 'mac_address':
            print(datas[1])
            connPool[datas[1]] = conn
            print('new conn:')
            print(connPool[datas[1]])
            conn.send('mqtt_server: get mac address'.encode('utf8'))
        #receive the device data
        elif datas[0] == 'device':
            data = datas[1].split(',')
            if(data[1] == 'muscle'): 
                payload = {
                    "state":{
                        "reported":{
                            "mac": data[0],
                            "msg": data[1],
                            "muscle_name": data[2],
                            "weight": data[3],
                            "count" : data[4],
                            "work_time": data[5],
                            "user_id": userPool[data[0]]
                        }
                    }  
                }
                myAWSIoTMQTTClient.publish("$aws/things/muscle_1/shadow/update",json.dumps(payload),1)
            elif(data[1] == 'equipment'):
                payload = {
                    "state":{
                        "reported":{
                            "mac": data[0],
                            "msg": data[1],
                            "equipment_name": data[2],
                            "weight": data[3],
                            "set" : data[4],
                            "user_id": userPool[data[0]]
                        }
                    }  
                }
                myAWSIoTMQTTClient.publish("$aws/things/muscle_1/shadow/update",json.dumps(payload),1)
            conn.send('device\n'.encode('utf8'))
    clientsocket.close()


print('server start at: %s:%s' % (HOST, PORT))
print('wait for connection...')

def main():
    global conn, addr
    try:
        while True:
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