# Muscle-Monitor
## What is this?
1. This is an amazing iot device
2. It can quantify the state of your muscles
3. You can use the APP to log in the device’s information, and the APP will keep track of which fitness settings you use each time you exercise.

## Architecture
- Hardware: 
    - Arduino platform using ESP8266 and pressure sensor.
- Cloud: 
    - Implement MQTT server to get and send ESP8266 data to AWS IoT and trigger Lambda function to update the database.
- Web application: 
    - Built an application with Vue.js and Express.js, and used MongoDB to store users and fitness information.

![image](https://user-images.githubusercontent.com/46760916/181739930-381e4e34-9d74-476d-8a53-9ce46335f329.png)

## DB schemas
![image](https://user-images.githubusercontent.com/46760916/181740086-4cf47072-e509-463c-8dcb-5001dc6bcbf1.png)

## [Demo video](https://www.youtube.com/watch?v=khjTGm6INEY)

