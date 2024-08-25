function get_data(){
    var apiKey = 'Put Your Weather API Key Here';
    var location = 'XXX';  // 你想要查詢的地區

    var apiUrl = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?locationName=' + location + '&Authorization=' + apiKey;  // 帶有參數的網址
    var response = UrlFetchApp.fetch(apiUrl);
    var weatherData = response.getContentText();
    var json = JSON.parse(weatherData);
    if(response.getResponseCode() == 200){
        var data = JSON.parse(response.getContentText());
        sendToLine(data);
        Logger.log("Data send!");
	}
    else{
        Logger.log("Can't get data!");
	}
}

function sendToLine(data){
  //填入Line Notify 權杖
  var token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  var loc = data["records"]["location"][0]["locationName"];
  var weather_elements = data["records"]["location"][0]["weatherElement"];
  var start_time = weather_elements[0]["time"][0]["startTime"];
  var end_time = weather_elements[0]["time"][0]["endTime"];
  var weather_state = weather_elements[0]["time"][0]["parameter"]["parameterName"];
  var rain_prob = weather_elements[1]["time"][0]["parameter"]["parameterName"];
  var min_tem = weather_elements[2]["time"][0]["parameter"]["parameterName"];
  var comfort = weather_elements[3]["time"][0]["parameter"]["parameterName"];
  var max_tem = weather_elements[4]["time"][0]["parameter"]["parameterName"];
  var message = "";
  message += "今天"+loc+"的天氣: "+weather_state+"\n";
  message += "溫度: "+min_tem+"°C - "+max_tem+"°C\n";
  message += "降雨機率: "+rain_prob+"%\n";
  message += "舒適度: "+comfort+"\n";
  message += "時間: "+start_time+" ~ "+end_time+"\n";
  if(rain_prob > 70){
      message += "提醒您，今天很有可能會下雨，出門記得帶把傘哦!";
  }
  else if(max_tem > 28){
      message += "提醒您，今天很熱，外出要小心中暑哦~";
  }
  else if(min_tem < 10){
    message += "提醒您，今天很冷，記得穿暖一點再出門哦~";
  }
  Logger.log(message);  // 可以透過這句指令預覽要傳送的通知內容
  var options =
  {
      method  : "post",
      payload : {"message" : message},
      headers : {"Authorization" : "Bearer "+ token},
      muteHttpExceptions : true
  };
  Logger.log(UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options));  // 主要發送通知是在這行指令
}
