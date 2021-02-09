var loginActionFlow,signUpActionFlow;
//SIGNUP
function signup(event){
    event.preventDefault();
    signUpActionFlow = new ActionEngine({
        actionSteps:[
            {
                actionStepIndex:1,
                method:checkUserExists,
                state:states["shunya"],
            },
            {
                actionStepIndex:2,
                method:alertAboutSignUp,
                state:states["0."],
                condition:{
                    completedActionSteps:[1]
                },
                fromPrevious:{
                    "exist":1
                }
            }
        ]
    })
}
function startExecutionSignupFlow(event){
    event.preventDefault();
    var username = document.getElementById('Rusername').value;
    var password = document.getElementById('Rpassword').value;
    console.log("Username:- " + username + ":::Password:- " + password);
    var data = {
        "username":username,
        "password":password
    }
    signUpActionFlow.updateActionStepArguments(data);
}
function checkUserExists(data){
    if(localStorage.getItem(data.username)=== null){
        localStorage.setItem(data.username,data.password);
        return false;
    }else
        return true;
}
function alertAboutSignUp(data){
    if(data.exist)
        alert('Username already exists');
    else
        alert("Credentials has been registered");
}
//LOGIN
function login(event){
    event.preventDefault();
    loginActionFlow = new ActionEngine({
        actionSteps:[
            {
                actionStepIndex:1,
                method:checkCredetials,
                state:states["shunya"],
            },
            {
                actionStepIndex:2,
                method:alertAboutLogin,
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
function startExecutionLoginFlow(event){
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    console.log("Username:- " + username + ":::Password:- " + password);
    var data = {
        "username":username,
        "password":password
    }
    loginActionFlow.updateActionStepArguments(data);
}
function checkCredetials(data){
    if(localStorage.getItem(data.username)=== data.password){
        return true;
    }else{
        return false;
    }
}
function alertAboutLogin(data){
    if(data.exist){
       alert('Entered correct crentials. :-)');
    }else if(!data.exist){
        alert("Entered wrong crdentials .Try Again");
    }else{
        alert("Something is fishy.Have a look at the console.");
    }
   
}

