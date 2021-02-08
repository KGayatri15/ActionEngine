function loginflow(event){
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log("Username:- " + username + ":::Password:- " + password);
    var data = {
        "username":username,
        "password":password
    }
    var loginActionFlow = new ActionEngine({
        actionSteps:[
            {
                actionStepIndex:1,
                method:checkCredetials,
                state:states.WAIT,
                arguments:data,
            },
            {
                actionStepIndex:2,
                method:this.alertAbout,
                state:states.START,
                required:{
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
    }else{
        alert("Entered wrong crdentials .Try Again");
    }
   
}

