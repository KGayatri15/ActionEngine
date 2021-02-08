const states = Object.freeze({
    START: Symbol(" ActionStep Started"),//0.
    WAIT: Symbol("Awaiting actionStep"),//shunya
    EXECUTING: Symbol("ActionStep in process"),//dot
    ERROR: Symbol("Error"),//e
    DONE: Symbol("ActionStep done")//1
})
class ActionEngine{
    constructor(options){
        this.actionSteps = options.actionSteps
        this.result = new Map()
        this.actionStepsExecuted=[]
        this.index
        this.executeActionSteps(this.actionSteps)
    }
    ActionStepError(index,exception){
        this.updateActionStepState(index,states.ERROR);
        console.log("An exception " + exception + " while performing the task " + ActionStepIndex);
    }
    static updateStartActionStep(){
        console.log("Now updating actionStep state to start " + this.index);
        this.actionSteps[this.index]['state'] = states.START;
    }
    updateActionStepState(index,state){
        this.actionSteps[index]['state'] = state;
    }   
    executeActionSteps(actionSteps){
        for(var i = 0 ;i< actionSteps.length;i++){
            this.index = i;
            console.log("The index of action Step " + this.index);
            if(operate.isEqualStrict(actionSteps[i]['state'],states.WAIT))
                console.log("Waiting: " + i);
            else{
                this.updateActionStepState(i,states.EXECUTING);
                var conditionExists = operate.isEqualStrict( actionSteps[i]['condition'],undefined);
                var checkSubset = conditionExists|| operate.isEqualStrict(actionSteps[i]['condition']['completedActionSteps'],undefined) || operate.hasAllof(actionSteps[i]['condition']['completedActionSteps'],this.actionStepsExecuted);
                var comparisonsCorrect = conditionExists|| operate.isEqualStrict(actionSteps[i]['condition']['compare'],undefined)|| this.compareValues(actionSteps[i]['condition']['compare']);
                if(checkSubset && comparisonsCorrect){
                        var input, noInput = false;
                        var argumentsExist = operate.isEqualStrict(actionSteps[i]['arguments'],undefined);
                        var requiredArgumentsExist = operate.isEqualStrict(actionSteps[i]['required'],undefined);
                        if(argumentsExist && requiredArgumentsExist )
                            noInput = true;
                        else if(argumentsExist)
                            input = this.includeArguments({},actionSteps[i]['required'])
                        else if(requiredArgumentsExist)
                            input = this.includeArguments(actionSteps[i]['arguments'],{})
                        else
                            input = this.includeArguments(actionSteps[i]['arguments'],actionSteps[i]['required'])
                        try{
                            if(noInput)
                                this.result[actionSteps[i]['actionStepIndex']] = actionSteps[i]['method'].call(this);
                            else
                                this.result[actionSteps[i]['actionStepIndex']] = actionSteps[i]['method'].call(this,input);
                            this.actionStepsExecuted.push(actionSteps[i]['actionStepIndex']);
                            this.updateActionStepState(i,states.DONE);
                        }catch(exception){
                            this.ActionStepError(actionSteps[i],exception);
                        }
                }
            }
            if(actionSteps[i]['state'] === states.WAIT){
                setTimeout(console.log("Retry Again"),1000)
                i = --i;
                console.log("After timeout:- " + i);
            }
            if(operate.isEqualStrict(actionSteps.length -1,i)){
                console.log("Execution of workflow is done");
            }
        }
        console.log(this.actionStepsExecuted);
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