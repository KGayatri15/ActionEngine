const boundary = '-------314159265358979323846';
const delimiter = "\r\n--" + boundary + "\r\n";
const close_delim = "\r\n--" + boundary + "--";
class HttpService{    
    static urlBuilder(url,params){
        var service = url +"?" +HttpService.buildEncodedUri(params);
        return service;
    }
    static requestBuilder(method,headers,body){
        var request = {
            method:method,
            cache: 'no-cache',
            headers:headers,
        }
        if(body !== undefined){
            request['body'] = body;
        }
        return request;
    }
    static Upload(url,type,header,file){
        var contentType = file.type || 'application/octet-stream';
        var metadata = {
            'title':file.name,
            'name':file.name,
            'mimeType':contentType,
        }
        console.log(metadata);
        var reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = function(e){
           console.log("Reader loaded");
            var base64Data = btoa(reader.result);
            var multipartRequestBody =
            delimiter + 'Content-Type: application/json\r\n\r\n' + JSON.stringify(metadata) +
            delimiter + 'Content-Type: ' + contentType + '\r\n' +  
            'Content-Transfer-Encoding: base64\r\n' + '\r\n' + base64Data + close_delim;
            return (HttpService.fetchRequest(url,HttpService.requestBuilder(type,header,multipartRequestBody)));
       }
    }
    static fetchRequest(url,request){
    console.log("URL :-" + url);
    console.log("Request method :" + request['method'] + "headers:" + request['headers']['Authorization'] + "body: " + request['body']);
    fetch(url,request)
           .then(response=>{console.log(response);return response.json()})
           .then(data=>{
               console.log(data);
                if(!data.errors){
                    if(data.spreadsheetId != undefined && assign){spreadsheetId = data.spreadsheetId;}
                    if( data.files != undefined && assign){files = data.files;if(files.length > 0){id = files[0].id;}}
                }else{
                    console.log(data.errors);
                }
            })
            .catch(err=>{
                console.log("Failed to make a request due to " + err);
            })
    }
    static buildEncodedUri(request) {
        const response = [];
        for (let d in request){
            response.push(encodeURIComponent(d) + '=' + encodeURIComponent(request[d]));
        }
        return response.join('&');
    }
    static unbuildEndodedUri(request) { 
        var urifragment = request.split("&"), data = {}, i, parts;
        //process each par
        for (i = 0; i < urifragment.length; i++) {
            parts = urifragment[i].split("=");
            if (parts.length < 2) {
                parts.push("");
            }
            data[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
        } 
        console.log(data);
        return data;    
    }    
}