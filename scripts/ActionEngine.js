const states = Object.freeze({
    0.: Symbol("START"),//0.
    shunya: Symbol("WAIT"),//shunya
    dot: Symbol("EXECUTING"),//dot
    e: Symbol("ERROR"),//e
    1: Symbol("DONE")//1
})
class ActionEngine{
    constructor(options){
        this.actionSteps = options.actionSteps;
        this.result = new Map(),
        this.actionStepsExecuted=[],
        this.index;
        console.log(this.actionSteps);
        this.executeActionSteps()
    }
    ActionStepError(index,exception){
        this.updateActionStepState(index,states["e"]);
        console.log("An exception " + exception + " while performing the task " + ActionStepIndex);
    }
    updateStartActionStep(){
       console.log("Updating state of actionSteps Index " + this.index);
       this.actionSteps[this.index]['state'] = states["0."];
    }
    updateActionStepState(index,state){
        this.actionSteps[index]['state'] = state;
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
                this.updateActionStepState(i,states["dot"]);
                var conditionExists = operate.isEqualStrict( this.actionSteps[i]['condition'],undefined);
                var checkSubset = conditionExists|| operate.isEqualStrict(this.actionSteps[i]['condition']['completedActionSteps'],undefined) || operate.hasAllof(this.actionSteps[i]['condition']['completedActionSteps'],this.actionStepsExecuted);
                var comparisonsCorrect = conditionExists|| operate.isEqualStrict(this.actionSteps[i]['condition']['compare'],undefined)|| this.compareValues(this.actionSteps[i]['condition']['compare']);
                if(checkSubset && comparisonsCorrect){
                        var input, noInput = false;
                        var argumentsExist = operate.isEqualStrict(this.actionSteps[i]['arguments'],undefined);
                        var requiredArgumentsExist = operate.isEqualStrict(this.actionSteps[i]['fromPrevious'],undefined);
                        if(argumentsExist && requiredArgumentsExist )
                            noInput = true;
                        else if(argumentsExist)
                            input = this.includeArguments({},this.actionSteps[i]['fromPrevious'])
                        else if(requiredArgumentsExist)
                            input = this.includeArguments(this.actionSteps[i]['arguments'],{})
                        else
                            input = this.includeArguments(this.actionSteps[i]['arguments'],this.actionSteps[i]['fromPrevious'])
                        try{
                            if(noInput)
                                this.result[this.actionSteps[i]['actionStepIndex']] = this.actionSteps[i]['method'].call(this);
                            else
                                this.result[this.actionSteps[i]['actionStepIndex']] = this.actionSteps[i]['method'].call(this,input);
                            this.actionStepsExecuted.push(this.actionSteps[i]['actionStepIndex']);
                            this.updateActionStepState(i,states["1"]);
                        }catch(exception){
                            this.ActionStepError(this.actionSteps[i],exception);
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
      
    includeArguments(arg,obj){
        for(var key in obj){
            arg[key] = this.result[obj[key]];
        }
        return arg;
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
}