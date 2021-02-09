var loginActionFlow;
function loginflow(event){
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log("Username:- " + username + ":::Password:- " + password);
    var data = {
        "username":username,
        "password":password
    }
    loginActionFlow = new ActionEngine({
        actionSteps:[
            {
                actionStepIndex:1,
                method:checkCredetials,
                state:states["shunya"],
                arguments:data,
            },
            {
                actionStepIndex:2,
                method:this.alertAbout,
                state:states["0."],
                condition:{
                    completedActionSteps:[1]
                },
                fromPrevious:{
                    "exist":1
                }
            },
        ]
    })
}
function checkCredetials(data){
    if(data.username === 'ae'&& data.password === 'ae'){
        return true;
    }else{
        return false;
    }
}
function alertAbout(data){
    if(data.exist){
       alert('Entered correct crentials. :-)');
    }else if(!data.exist){
        alert("Entered wrong crdentials .Try Again");
    }else{
        alert("Something is fishy.Have a look at the console.");
    }
   
}

