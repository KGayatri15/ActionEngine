var authorization,spreadsheetId,range,assign = false;
var arr = ['A','B','C','D','E','F','G','H','I','J','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var info = {
    'spreadsheet':{
        'url':'https://sheets.googleapis.com/v4/spreadsheets',
        'headers':{
            'Accept':'application/json',
            'Content-Type':'application/json',
        }
    },
}
class JSON2Spreadsheet{
    static handleActions(event,type){
        event.preventDefault();var body;
        var header = info['spreadsheet']['headers'];
        header['Authorization'] = authorization;
        var url = info['spreadsheet']['url'];
        type === "CREATE"?assign = true:assign = false;
        switch(type){
            case "CREATE":{
                            body = {
                                "properties":{
                                    "title":'JSON2Spreadsheet'
                                },  
                            }
                            HttpService.fetchRequest(url,HttpService.requestBuilder("POST",header,JSON.stringify(body)));
                            break;
                        }
            case "APPEND":{
                            var output = mutate.Obj2(sample, []);
                            range = "Sheet1!A1:" + arr[output[0].length -1] + (output.length);
                            url = url +'/' + spreadsheetId +'/values/' + range +':append?valueInputOption=USER_ENTERED';
                            body = {
                                "range":range,
                                "majorDimension":"ROWS",
                                "values":output
                            }
                            HttpService.fetchRequest(url,HttpService.requestBuilder("POST",header,JSON.stringify(body))); 
                            break;
            }
            case "GET":{
                            url = url + '/' + spreadsheetId + '/values/' + range;
                            HttpService.fetchRequest(url,HttpService.requestBuilder("GET",header));
                            break;
            }
            default:alert("Spreadsheet is not defined,Create a spreadsheet initially.");
        }
    }
}

