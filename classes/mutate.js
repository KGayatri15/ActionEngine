function getEntityType(entity) {
    return Object.getPrototypeOf(entity).constructor.name;//entity.__proto__.constructor.name
}
var row = new Array('ehhid', 'd', 'parent', 'entity', "typeOf", "path");

class mutate { 

    static fillEmptyDepth(input, output) {
        // console.log("filling gap",input,output)
        for (var j = 1; j <= output[0].length - input.length; j++) {
            input.push("");
        }
        return input;
    }
    
    //this function primarly check for the presence of a keys in any an array, if not present and options [ returns false and update and return position]
    static validateNupdate(input, output) {

        if (output[0].indexOf(input) === -1 && typeof input !== null && typeof input !== undefined) {
           console.log("Input " + input);
           output[0].push(input);
           console.log("Output " + output[0]);
        }
        // console.log(output[0], input);
        return output;
    }
    static createRow(input, output, previousRow, currentKey, d, path) {
        var id = output.length;
        var newRow = [id, d, previousRow[3], currentKey, input?.constructor.name, path];
        return newRow;
    }

    static updateRow(input, output, previousRow, currentRow, currentKey, d, path) {
        mutate.fillEmptyDepth(currentRow, output)
        // console.log("current Key in updation",currentKey,input,currentRow,previousRow)
        //Adding the inputValue in the currentRow at the index of the currentKey, also deletes an empty space from before.
        currentRow.splice(output[0].indexOf(currentKey), 1, input);
        //  console.log("updated Row",currentRow)
        return currentRow;
    }
    static setEntity(input, output, key) { 
       var  outputType = getEntityType(output);
      //  console.log(outputType);
        switch (output?.constructor) { 
            case Object:
                output[key] = input[key];
            case Array:
                if (key) {
                    output.push(input[key])
                } else { 
                    output.push(input);
                }
            case String:
                default:
        }

        return output;
    }
    static Obj2(input, output, previousRow, currentRow, currentKey, d, path, parent) {
        if (!previousRow) {
            mutate.setEntity(row, output);
            
            previousRow = output[0];
            //  parent = "root";
          //  console.log(previousRow);
            path = '';
        };
        if (!d) { var d = 0; }
        d = d + 1;
        switch (input?.constructor) {
            case Object:
                path = path + '.' + previousRow[3];
                mutate.processObj(input, output, previousRow, currentRow, currentKey, d, path, previousRow[3]);
            case Array:
           
                path = path + '.' + previousRow[3];
                mutate.processArr(input, output, previousRow, currentRow, currentKey, d, path, previousRow[3]);
            default:
            // return
        }
        //  console.log(output)
        return output;
    }
    static processObj(input, output, previousRow, currentRow, currentKey, d, path, parent) {
        for (var key in input) {
            if (!input.hasOwnProperty(key)) continue;
            if (getEntityType(input[key]) === 'Object' || getEntityType(input[key]) === 'Array') {
                // console.log(path)
                var currentRow = mutate.createRow(input[key], output, previousRow, key, d, path, previousRow[3]);
                mutate.setEntity(currentRow, output);
                mutate.Obj2(input[key], output, currentRow, currentRow, currentKey, d, path, currentRow[3]);

            } else if (getEntityType(input[key]) === 'String' || getEntityType(input[key]) === 'Function' || getEntityType(input[key]) === 'Boolean'|| getEntityType(input[key])=== 'Number') {
                mutate.validateNupdate(key, output);
                mutate.updateRow(input[key], output, previousRow, previousRow, key, d, path);
            } else {
                //   console.log("errand", key, input[key],typeof key)
            }
        }
        return output;
    }
    static processArr(input, output, previousRow, currentRow, currentKey, d, path, parent) {
        for (var i = 0; i < input.length; i++) {
            if (typeof input[i] === "object" && input[i] !== null) {
                if (typeof currentRow[3] === 'undefined') {
                    //      console.log(currentRow)   
                    
                    mutate.updateRow(currentKey, output, previousRow, currentRow, 'root', d, path);
                    console.log("Finding Array Values", previousRow)
                } else {
                    console.log("Finding Array Values",currentRow)

                    var currentRow = mutate.createRow(input[i], output, previousRow, previousRow[3] + i, d, path);
                    mutate.setEntity(currentRow, output);
//                    output.push(currentRow);
                }
                mutate.Obj2(input[i], output, currentRow, currentRow, currentKey, d, path);

            } else {
                //creating Value Row for Array Parent
                var currentRow = mutate.createRow(input[i], output, previousRow, input[i], d, path);
                mutate.setEntity(currentRow, output);
           //     console.log(currentRow)
              //  output.push(currentRow);
            }
        }
        return output
    }
    static arr2Object (input ,parent,output){
        for(var j in input){ 
         var index;        
          if(input[j][2] === parent[3]&&((input[j][5].includes(parent[5]) && input[j][1] === 1+ parent[1])||(input[j][1]===1&&parent[1]==="d"))){
            if(parent[4] === "Array" && (input[j][4] === "String"|| input[j][4] === "Number")){
              output.unshift(input[j][3]);
            }else if(input[j][4] === "Object"){
                var obj = {};
                if(input[j].length > 6){
                    for(var k = 6;k < input[j].length;k++){
                        if(input[j][k] !== "")
                            obj[input[0][k]] = input[j][k];
                    }
                }
                if(parent[4]=== "Array"){
                        var index = input[j][3].replace(input[j][2],"");
                        output.unshift(obj);
                }else
                        output[input[j][3]] = obj;
            }else if(input[j][4] === "Array"){
              output[input[j][3]] = [];
            }
            if(input[j][4] === "Object" && parent[4] === "Array")
                this.arr2Object(input,input[j],output[index]);
            else
                this.arr2Object(input,input[j],output[input[j][3]]);
          }
        }
        return output;
      }
}

function start1() {
   
    console.log("Input:- Object To Array");
    console.log(actionflowSample);
    var outputArray = mutate.Obj2(actionflowSample, []);
    console.log("output Array[Input:- Array To Object] ", outputArray);
    document.getElementById('opArray').value = outputArray;
    var outputJson = mutate.arr2Object(outputArray,outputArray[0] ,{});
    console.log("Output :- Array To Object");
    console.log(outputJson);
    document.getElementById('opJSON').value = outputJson;
}
