#include "Arduino.h"
#include <ESP8266WiFi.h>
#include <SoftwareSerial.h>
#include <stdio.h>
#include "env.h"

//wifi
WiFiClient client;
const char* ssid     = myssid;
const char* password = ssid_pwd;
const char* host = host_name;
const uint16_t port = host_port;

//btn
int N_pin = A0;
int N_val = 0;
bool btn_up = true;
unsigned long show_time = 0;
unsigned long btn_last_time = 0;//debounce
int count = 0;
int work_time = 0;

//send msg info
String muscle_name = "";
String weight = "";
bool get_muscle = false;
bool get_weight = false;

//state
enum State {
    CONNECT,
    INIT,
    SEND
};
enum State state = CONNECT;
bool create_muscle_task = false;

void wifi_init(){
  Serial.println();
//  it can set the wifi module mac_address
//  uint8_t *macAddr = (uint8_t*)"FAN001";
//  WiFi.macAddress((uint8_t*)macAddr);
  Serial.print("MAC Address: ");
  Serial.println(WiFi.macAddress());
  Serial.print("Connecting to ");
  Serial.println(ssid);

  /* Explicitly set the ESP8266 to be a WiFi-client, otherwise, it by default,
     would try to act as both a client and an access-point and could cause
     network-issues with your other WiFi-devices on your WiFi-network. */
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());

  while(1){
    if (!client.connect(host, port)) {
      Serial.println("connection failed");
      delay(5000);
    }
    else break;
  }
}
              
void setup() {
  Serial.begin(115200);
  wifi_init();
  pinMode(A0, INPUT);
}

void device_connect(){
  String buf;
  Serial.println("sending mac_address to server");
  if (client.connected()) {
    String send_string = "mac_address@@@@" + WiFi.macAddress();
    client.println(send_string);
  }
  
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> ReSend");
      return;
    }
  }
  
  while (client.available()) {
    char ch = static_cast<char>(client.read());
    buf += ch;
    Serial.print(ch);
  }
  Serial.println();

  if(buf == "mqtt_server: get mac address") state = INIT;
}

void analysis_msg(String buf){
  int start = 0;
  int end = buf.indexOf(',');
  String subbuf = buf.substring(start, end - start);
  if(subbuf == "muscle_name"){
    start = end + 1;
    end = buf.indexOf(',');
    muscle_name = buf.substring(start, end - start); 
    get_muscle = true;
  }
  else if(subbuf == "equipment_weight"){
    start = end + 1;
    end = buf.indexOf(',');
    weight = buf.substring(start, end - start);
    get_weight = true;
  }
}

void device_init(){
  String buf;
  bool checkmsg = false;
  while (client.available()) {
    char ch = static_cast<char>(client.read());
    buf += ch;
    Serial.print(ch);
    if(ch == '\n') checkmsg = true;
  }
  
  if(checkmsg) analysis_msg(buf);
  if(get_muscle && get_weight) state = SEND;
}

void device_send(){
  String buf;
  bool checkmsg = false;
  while (client.available()) {
    char ch = static_cast<char>(client.read());
    buf += ch;
    Serial.print(ch);
    if(ch == '\n') checkmsg = true;
  }
  if(checkmsg) analysis_msg(buf);

  int N_val = analogRead(N_pin);
  bool btn_val = 0;
  if(N_val>10)Serial.println(N_val);
  delay(3);

  unsigned long now_time = millis();
  if(btn_val && btn_up){
    if(now_time - btn_last_time > 150){
      count++;
      btn_up = false;
      btn_last_time = now_time;
    }
  }
  else if(!btn_val && !btn_up){
    btn_up = true;
    work_time += now_time - btn_last_time;
    btn_last_time = now_time;
  }

  if(now_time - show_time >= 5000){
    String send_string = "device@@@@" + WiFi.macAddress()+ "," + muscle_name + "," + weight + "," +
                          String(count) + "," + String(work_time);
    if (client.connected()) {
      client.println(send_string);
    }
    
    show_time = now_time;
    work_time = 0;
    count = 0;
  }
}

void loop() {
  switch(state){
    //device need to send its mac_address to mqtt_server
    case CONNECT: 
      device_connect();
      break;
    //device gets the muscle and weight info 
    case INIT: 
      device_init();
      break;
    //after server has known the mac and device has got the info,it can send message to mqtt_server
    case SEND: 
      device_send();
      break;
  }
}
