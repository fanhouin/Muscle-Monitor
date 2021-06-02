#include <Arduino_FreeRTOS.h>
#include <SoftwareSerial.h>
#include <stdio.h>
#include "ESP8266.h"
#include "env.h"

//wifi
#define SSID        ssid
#define PASSWORD    ssid_pwd
#define HOST_NAME   host_name
#define HOST_PORT   (host_port)
SoftwareSerial mySerial(8,9);
ESP8266 wifi(mySerial);

//btn
int btnpin = 6;
bool btn_up = true;
unsigned long show_time = 0;
unsigned long btn_last_time = 0;//debounce
int count = 0;
int work_time = 0;

static TaskHandle_t muscle_task_handle = NULL;
static TaskHandle_t wifi_task_handle = NULL;

void wifi_init(){
  Serial.print("setup begin\r\n");
  Serial.print("FW Version:");
  Serial.println(wifi.getVersion().c_str());
    
  if (wifi.setOprToStationSoftAP()) {
      Serial.print("to station + softap ok\r\n");
  } else {
      Serial.print("to station + softap err\r\n");
  }

  if (wifi.joinAP(SSID, PASSWORD)) {
      Serial.print("Join AP success\r\n");
      Serial.print("IP:");
      Serial.println( wifi.getLocalIP().c_str());       
  } else {
      Serial.print("Join AP failure\r\n");
//      wifi_init();
  }
  
  if (wifi.disableMUX()) {
      Serial.print("single ok\r\n");
  } else {
      Serial.print("single err\r\n");
  }
  
  Serial.print("setup end\r\n");

  if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
      Serial.print("create tcp ok\r\n");
  } else {
      Serial.print("create tcp err\r\n");
  }
}
              
void setup() {
  Serial.begin(9600);
  pinMode(btnpin, INPUT);
  wifi_init();
  
  xTaskCreate(muscle_sensor, "muscle_sensor", 128, NULL, 1, &muscle_task_handle);
  xTaskCreate(wifi_send_recv, "wifi_send_recv", 256, NULL, 1, &wifi_task_handle);
}

void muscle_sensor(void *pvParameters){
  for(;;){
    int btn_val = digitalRead(btnpin);
    unsigned long now_time = millis();
    if(btn_val && btn_up){
      if(now_time - btn_last_time > 150){
        count++;
        btn_up = false;
        btn_last_time = now_time;
//        Serial.println(btn_val);
      }
    }
    else if(!btn_val && !btn_up){
      btn_up = true;
      work_time += now_time - btn_last_time;
      btn_last_time = now_time;
    }
  
    if(now_time - show_time >= 10000){
      vTaskSuspend(wifi_task_handle);
//      Serial.print("count: ");
//      Serial.print(count);
//      Serial.print("| work_time: ");
//      Serial.println(work_time);
      String send_string = String(count) + "," + String(work_time);
      const char *send_char = send_string.c_str();
      wifi.send(send_char, strlen(send_char));
//      Serial.println("send");
      
      show_time = now_time;
      work_time = 0;
      count = 0;
      vTaskResume(wifi_task_handle);
    }
  }
}

void wifi_send_recv(void *pvParameters){
  bool create_led_task = false;
  for(;;){

    uint8_t buffer[128] = {0};
    uint32_t len = wifi.recv(buffer, sizeof(buffer), 10000);
    if (len > 0) {
        for(uint32_t i = 0; i < len; i++) {
            Serial.print((char)buffer[i]);
        }
        Serial.print("\r\n");
    }
    vTaskDelay(1000/portTICK_PERIOD_MS);
  }
}

void loop() {


}
