const states = Object.freeze({
    0.: Symbol("START"),//0.
    shunya: Symbol("WAIT"),//shunya
    dot: Symbol("EXECUTING"),//dot
    e: Symbol("ERROR"),//e
    1: Symbol("DONE")//1
})
class ActionEngine{
    constructor(actionFlow){
        this.actionSteps = actionFlow.actionSteps;
        this.actionStepData = {}, this.intialise();
        this.actionStepsExecuted=[],this.index;
        this.executeActionSteps()
    }
    ActionStepError(exception){
        this.updateState(states["e"]);
        console.log("An exception " + exception + " while performing the task " + this.actionSteps[this.index]['actionStepIndex']);
    }
    updateActionStepArguments(data){
       console.log("Updating arguments and state of actionStep array Index " + this.index);
       this.includeArguments(data,"Include");
       this.updateState(states["0."]);
    }
    updateState(state){
        this.actionSteps[this.index]['state'] = state;
    }   
   async executeActionSteps(){
        for(var i = 0 ;i< this.actionSteps.length;i++){
            this.index = i;
            console.log("At actionStep index:- " + i);
            if(operate.isEqualStrict(this.actionSteps[i]['state'],states["shunya"])){
                console.log("Waiting");
                await this.sleep(2000)
                    .then( ()=>{ i = --i ;  console.log("After timeout:- " + i);})
            }
            else{
                this.updateState(states["dot"]);
                var conditionExists = operate.isEqualStrict( this.actionSteps[i]['condition'],undefined);
                var checkSubset = conditionExists|| operate.isEqualStrict(this.actionSteps[i]['condition']['completedActionSteps'],undefined) || operate.hasAllof(this.actionSteps[i]['condition']['completedActionSteps'],this.actionStepsExecuted);
                var comparisonsCorrect = conditionExists|| operate.isEqualStrict(this.actionSteps[i]['condition']['compare'],undefined)|| this.compareValues(this.actionSteps[i]['condition']['compare']);
                if(checkSubset && comparisonsCorrect){
                        var Noarguments = operate.isEqualStrict(this.actionSteps[i]['arguments'],undefined);
                        var NofromPrevious = operate.isEqualStrict(this.actionSteps[i]['fromPrevious'],undefined);
                        if(!Noarguments)
                            this.includeArguments(this.actionSteps[i]['arguments'],'Include')
                        if(!NofromPrevious)
                            this.includeArguments(this.actionSteps[i]['fromPrevious'],'Previous')
                        var arr = [];
                        arr = this.actionSteps[i]['method'].split(".");
                        console.log(arr[0] + "::" + arr[1] + " and it's type:-" + typeof(arr[0]));
                        try{
                            this.actionStepData[this.actionSteps[i]['actionStepIndex']]['output'] = conductor.conductForEachFlow(arr[0],arr[1],this.actionStepData[this.actionSteps[i]['actionStepIndex']]['arguments']);
                            this.actionStepsExecuted.push(this.actionSteps[i]['actionStepIndex']);
                            this.updateState(states["1"]);
                        }catch(exception){

                            this.ActionStepError(exception);
                            throw new Error(exception);
                        }
                }
                console.log("Completed Tasks till now" + this.actionStepsExecuted);
            }
            if(operate.isEqualStrict(this.actionSteps.length -1,i) && this.actionSteps[this.actionSteps.length-1]['state'] !== states["shunya"]){
                console.log("Execution of workflow is done");
            }
        }
        console.log(this.actionStepsExecuted);
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    includeArguments(obj,from){
        for(var key in obj){
            if(operate.isEqualStrict(from,"Previous"))
                this.actionStepData[this.actionSteps[this.index]['actionStepIndex']]['arguments'][key]  = this.actionStepData[obj[key]]['output'];
            else if(operate.isEqualStrict(from,"Include"))
                this.actionStepData[this.actionSteps[this.index]['actionStepIndex']]['arguments'][key] = obj[key];
        }
        console.log("Included arguments as mentioned");
    }
    compareValues(comparisons){
        var count = 0;
        for(let comparison of comparisons){
            //find it's equal or type or whatever compare it with value if yes increase count else not
            if(comparison.hasOwnProperty("equal")&& operate.isEqualStrict(comparison['equal'],this.result[comparison['value']])){
               console.log("Equal comparison done");
                count++;
            }else if(comparison.hasOwnProperty("type") && operate.isEqualStrict(comparison['type'],typeof(this.result[comparison['value']]))){
                console.log("Type checked");
                count++;
            }
        }
        if(operate.isEqualStrict(count,comparisons.length))
            return true;
        return false;
    }
    intialise(){
        for(var i=0;i< this.actionSteps.length;i++){
            this.actionStepData[this.actionSteps[i]['actionStepIndex']] = {};
            this.actionStepData[this.actionSteps[i]['actionStepIndex']]['arguments']= {};
        }  
        console.log("Initialization Done !");
    }
}