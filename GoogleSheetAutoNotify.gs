function getFormData() {
	// 請填入 Line Notify 權杖
	var token = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
	var spreadSheet = SpreadsheetApp.getActive();
	var sheet = spreadSheet.getActiveSheet();
	var lastRow = sheet.getLastRow();
	var lastColumn = sheet.getLastColumn();
	var head = sheet.getSheetValues(1, 1, 1, lastColumn);
	var sheetData = sheet.getSheetValues(lastRow, 1, 1, lastColumn);
	var message = "\n";
	Logger.log(sheetData);
	//組合訊息
	for (var i=0;i<lastColumn;i++){
		if (sheetData[0][i]){
			message += head[0][i] + "：" + sheetData[0][i] + "\n";
		}
	}
	Logger.log(message);
	sendLineNotify(message, token);
}
function sendLineNotify(message, token) {
	var options ={
		"method": "post",
		"payload": { "message": message },
		"headers": { "Authorization": "Bearer " + token }
	};
	UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
