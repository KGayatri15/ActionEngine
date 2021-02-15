var SpreadsheetActionFlow;
function startSpreadsheetFlow(event){
    event.preventDefault();
    SpreadsheetActionFlow = new ActionEngine({
        actionSteps:[
            {
                actionStepIndex:1,
                method:"Authorization.oAuth",
                state:states["0."],
                arguments:{
                    "data":'json'
                }
            },
            {
                actionStepIndex:2,
                method:"Authorization.authToken",
                state:states["shunya"],
                condition:{
                    completedActionSteps:[1]
                }
            },
        ]
    });
}


