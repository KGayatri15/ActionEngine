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
        this.actionStepData = {},
        this.actionStepsExecuted=[],
        this.index;
        console.log(this.actionSteps);
        this.intialise();
        this.executeActionSteps()
    }
    ActionStepError(index,exception){
        this.updateActionStepState(index,states["e"]);
        console.log("An exception " + exception + " while performing the task " + this.actionSteps[index]['actionStepIndex']);
    }
    updateActionStepArguments(data){
       console.log("Updating arguments of actionSteps Index " + this.index);
       this.includeArguments(this.index,data,"Include");
       this.updateActionStepState(this.index,states["0."]);
    }
    updateStateOfActionStep(){
        console.log("Updating state of actionSteps Index " + this.index);
        this.updateActionStepState(this.index,states["0."]);
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
                        var  noInput = false;
                        var Noarguments = operate.isEqualStrict(this.actionSteps[i]['arguments'],undefined);
                        var NofromPrevious = operate.isEqualStrict(this.actionSteps[i]['fromPrevious'],undefined);
                        if(Noarguments && NofromPrevious && operate.isEqualStrict(this.actionStepData[this.actionSteps[i]['actionStepIndex']]['arguments'],{}))
                            noInput = true;
                        if(!Noarguments)
                            this.includeArguments(i,this.actionSteps[i]['arguments'],'Include')
                        if(!NofromPrevious)
                            this.includeArguments(i,this.actionSteps[i]['fromPrevious'],'Previous')
                        try{
                            if(noInput)
                                this.actionStepData[this.actionSteps[i]['actionStepIndex']]['output'] = this.actionSteps[i]['method'].call(this);
                            else
                                this.actionStepData[this.actionSteps[i]['actionStepIndex']]['output'] = this.actionSteps[i]['method'].call(this,this.actionStepData[this.actionSteps[i]['actionStepIndex']]['arguments']);
                            this.actionStepsExecuted.push(this.actionSteps[i]['actionStepIndex']);
                            this.updateActionStepState(i,states["1"]);
                        }catch(exception){
                            this.ActionStepError(i,exception);
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
    includeArguments(index,obj,from){
        for(var key in obj){
            if(operate.isEqualStrict(from,"Previous"))
                this.actionStepData[this.actionSteps[index]['actionStepIndex']]['arguments'][key]  = this.actionStepData[obj[key]]['output'];
            else if(operate.isEqualStrict(from,"Include"))
                this.actionStepData[this.actionSteps[index]['actionStepIndex']]['arguments'][key] = obj[key];
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