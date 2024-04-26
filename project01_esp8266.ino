#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

const char* ssid = "Kevin-Wi-Fi.";
const char* password = "kevi2005";
const char* serverUrl = "http://192.168.0.114:3000/coordinates";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    int n = WiFi.scanNetworks();
    Serial.println("Scan done");
    if (n == 0) {
      Serial.println("No networks found");
    } else {
      WiFiClient client;
      HTTPClient http;
      http.begin(client, serverUrl);
      http.addHeader("Content-Type", "application/json");

      String postData = "{\"wifiAccessPoints\": [";
      for (int i = 0; i < n; ++i) {
        if (i > 0) postData += ",";
        postData += "{\"macAddress\":\"" + WiFi.BSSIDstr(i) + "\", \"signalStrength\":" + WiFi.RSSI(i) + "}";
      }
      postData += "]}";

      Serial.println("Sending data: " + postData);
      int httpResponseCode = http.POST(postData);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Received back: " + response);
      } else {
        Serial.println("Error on sending POST: " + httpResponseCode);
      }
      http.end();
    }
    delay(10000);  // Send every 10 seconds
  }
}
