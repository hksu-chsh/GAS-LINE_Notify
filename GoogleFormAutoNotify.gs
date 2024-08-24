function getFormResponse() {  
  //由表單 Id 開啟表單
  var form = FormApp.openById("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");  // 請填入回應Google表單的ID
  //取得表單名稱
  var formTitle = form.getTitle();
  //取得表單回覆內容
  var formResponse = form.getResponses();   
  //處理表單上問答內容
  for(var i = 0; i < formResponse.length ; i++){
    //取得表單上的項目
    var itemResponses = formResponse[i].getItemResponses();
    //取得表單上「收集電子郵件地址」
    var itemRespondentEmail = formResponse[i].getRespondentEmail();
    //Logger.log(itemRespondentEmail);
    //傳送訊息設定
    var itemContext = formTitle + "\n 填報者電子郵件 : " + itemRespondentEmail + "\n";
    //將表單每一項問答組成訊息
    for(var j = 0; j < itemResponses.length ; j++){
      //取得問題標題
      itemContext += itemResponses[j].getItem().getTitle();    
      //取得問題回覆內容
      itemContext += " : " + itemResponses[j].getResponse() + "\n";
    }
    //取得填寫表單時間
    itemContext += "\n填寫時間 : " + formResponse[i].getTimestamp() + "\n\n";
    //送出表單到Line
    sendToLine(itemContext);
  }
  //刪除回應問題
  form.deleteAllResponses();
}

function sendToLine(message){
  var token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";  // 請填入 Line Notify 權杖
  var options ={
      method  : "post",
      payload : "message=" + message,
      headers : {"Authorization" : "Bearer "+ token},
      muteHttpExceptions : true
  };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}
