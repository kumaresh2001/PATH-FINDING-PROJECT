//----------------------------------------------------    GLOBAL VARIABLES DECLARATION STARTS   ----------------------------------------------------//
var WEIGHTED_ALGORITHM_LIST = ["DIJKSTRA", "BESTFIRSTSEARCH", "ASTAR"];
var sourcevar=false,destinationvar=false,foundEren=false;
var sourceclassname="",destinationclassname="";
var tempdest,tempsource;
var discoverqueue=[],tracedPath=[];
var discoverParentMap = {};
//source var and destinationvar used to activate selecting source and destination
var directionArray = [[0,-1],[0,1],[-1,0],[1,0]],directionPointer=0;
var discoveredCo_ordinates = new Array();
var ij=0;
var isVisualizationActive = false;
//declaration and initialisation of board
var board = new Array(20);
//variables for dijkstra
var visitedNodesMap = {};
var destinationStrings = [],destinationIterator=0;
var userMapWeightBoard = new Array(20);
var enableWeights = false;
var recentlyMarkedWeightedNode;
//----------------------------------------------------    GLOBAL VARIABLES DECLARATION ENDS    ----------------------------------------------------//

//initialise dijkstar's board
function initialiseUserMapWeightBoard()
{
    for(let i=0;i<20;i++)
    {
        userMapWeightBoard[i] = new Array(60);
        for(let j=0;j<60;j++)
        {
            if(i==0||i==19||j==0||j==59)
            userMapWeightBoard[i][j] = -1;
            else    
            userMapWeightBoard[i][j] = 1;
        }
    }
}
//function declarations
function clearBoard()
{
    for(var i=0;i<20;i++)
    {
        board[i] = new Array(60);
    }
    for(var i=0;i<20;i++)
    {
        for(var j=0;j<60;j++)
        {
            if(i==0||i==19||j==0||j==59)
            {
                board[i][j] = -1;
            }
            else{
                board[i][j] = 1;
            }
        }
    }

}

function clearMap()
{
    for(let i=1;i<19;i++)
    {
        for(let j = 1;j<59;j++)
        {
            document.getElementById(i+"-"+j).className = "";
        }
    }
    initialiseUserMapWeightBoard();
}

function resetMap()
{
    if(!isVisualizationActive)
    {
        clearBoard();
        clearMap();    
        checkuserMapBoard();
        foundEren = false;
        tracedPath = [];
        discoverqueue = [];
        discoverParentMap = {};
    }
}

function getSourceElement()
{
    return document.getElementsByClassName("source")[0];
}

function getDestinationElement()
{
    return document.getElementsByClassName("destination")[0];
}

//check if source and destination elements are specified before visualization
function isSourceDestinationDefined()
{
    let sourceElement = getSourceElement();
    if(typeof(sourceElement)==="undefined")
    {
        alert("Select a Source");
        return false;
    }
    var destinationElement = getDestinationElement();
    if(typeof(destinationElement)==="undefined")
    {
        alert("Select a Destination");
        return false;
    }
    return true;
}


//to let mark function know we have to mark source
function source()
{
    if(!isVisualizationActive)
    {
        sourcevar = !sourcevar;
        destinationvar=false;    
        enableWeights = false;
    }
}
function destination()
{
    if(!isVisualizationActive)
    {
        destinationvar=!destinationvar;
        sourcevar=false;    
        enableWeights = false;
    }
}

function mark(i,j)
{
    if(!isVisualizationActive)
    {
        //to remove destination if cell is already marked as destination
        let selectedElement = document.getElementById(i+"-"+j);
        
        //to see if we have to mark source
        if(sourcevar)
        {
            if(selectedElement.className.includes("wall") || selectedElement.className.includes("destination"))
                return;
            var prevSource = document.getElementsByClassName("source");
            //if there are no elements with className source the variable becomes undefined
            if(typeof(prevSource[0])!="undefined")
            {
                prevSource[0].innerHTML = "";
                prevSource[0].className = sourceclassname;
            }
            if(i==0||i==19||j==0||j==59)
            {
                alert("DO NOT SELECT BORDER");
                return;
            }
            var x = document.getElementById(i+"-"+j);
            sourceclassname = x.className;
            x.className += " source";
            return;
        }
        else if(destinationvar)
        {
            if(selectedElement.className.includes("wall") || selectedElement.className.includes("source"))
                return;
            var prevdestination = document.getElementsByClassName("destination");
            if(document.getElementById("algoSelector").value === "DIJKSTRA")
            {
                if(i==0||i==19||j==0||j==59)
                {
                    alert("DO NOT SELECT BORDER");
                    return;
                }
                var x = document.getElementById(i+"-"+j);
                if(x.className.includes("destination"))
                {
                    x.className = x.className.replace("destination","");
                    destinationStrings.splice(destinationStrings.indexOf(x.id),1);
                }
                else
                {
                    x.className += " destination";
                    if(!destinationStrings.includes(x.id))
                        destinationStrings.push(x.id);    
                }
            }
            else
            {
                //if there are no elements with className source the variable becomes undefined
                if(typeof(prevdestination[0])!="undefined")
                {
                    prevdestination[0].innerHTML = "";
                    prevdestination[0].className = destinationclassname;
                }
                if(i==0||i==19||j==0||j==59)
                {
                    alert("DO NOT SELECT BORDER");
                    return;
                }
                var x = document.getElementById(i+"-"+j);
                destinationclassname = x.className;
                x.className += " destination";
            }
        }
        else
        {
            let selectedElement = document.getElementById(i+"-"+j);
            if(selectedElement.className.includes("source") || selectedElement.className.includes("destination"))
                return;
            selectedElement.className = selectedElement.className.includes("wall") ? selectedElement.className.replace("wall","") : (selectedElement.className + " wall");
        }  

    }
    
}

function checkuserMapBoard()
{
    let currentSelectedAlgo = document.getElementById("algoSelector").value;
    for(let i =1;i<19;i++)
    {
        for(let j=1;j<59;j++)
        {
            let cellInnerHTML = WEIGHTED_ALGORITHM_LIST.includes(currentSelectedAlgo) && userMapWeightBoard[i][j] > 1 ? userMapWeightBoard[i][j] : "";
            document.getElementById(i+"-"+j).innerHTML = cellInnerHTML;
        }
    }
}

function modifyWeight(event,i,j)
{
    if(WEIGHTED_ALGORITHM_LIST.includes(document.getElementById("algoSelector").value) && !document.getElementById(i+"-"+j).className.includes("wall"))
    {
        let directionOfScroll = event.deltaY < 0 ? "up" : "down";
        let displayValue;
        if(directionOfScroll === "up")
            displayValue = ++userMapWeightBoard[i][j];
        else
            displayValue = (userMapWeightBoard[i][j] === 1 ? "":--userMapWeightBoard[i][j]);
        document.getElementById(i+"-"+j).innerHTML = displayValue;    
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* DFS Methods Starts here - to be encapsulated soon */
function DFSDiscover(x,y)
{
        
        if(x<=0||x>=19||y<=0||y>=59 || document.getElementById(x+"-"+y).className.includes("wall") )
        {
            return 0;
        }
        let discoverClassName  =  document.getElementById(x+"-"+y).className;
    
        if(discoverClassName.includes("discover")||discoverClassName.includes("source"))
        {
            return 0;
        }
    
        if(discoverClassName.includes("destination"))
        {
            return 1;
        }

        document.getElementById(x+"-"+y).className += " discover";
        if(DFSDiscover(x-1,y))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        if(DFSDiscover(x,y+1))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        if(DFSDiscover(x+1,y))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        if(DFSDiscover(x,y-1))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        return 0;
}

async function DFSDiscovered(discoveredCo_ordinates)
{
    for(var ij=0;ij<discoveredCo_ordinates.length;ij++)
    {
        await sleep(50);
        document.getElementById(discoveredCo_ordinates[ij][0]+"-"+discoveredCo_ordinates[ij][1]).className+=" discovered";
    }
    isVisualizationActive = false;
}
 function findDFSPath()
{
    let sourceIndex = document.getElementsByClassName("source")[0].id.split("-");    
    DFSDiscover(parseInt(sourceIndex[0])-1,parseInt(sourceIndex[1])) ? "" : 
    (
        DFSDiscover(parseInt(sourceIndex[0]),parseInt(sourceIndex[1])+1) ? "" : 
        (
            DFSDiscover(parseInt(sourceIndex[0])+1,parseInt(sourceIndex[1])) ? "" :
            (
                DFSDiscover(parseInt(sourceIndex[0]),parseInt(sourceIndex[1])-1)
            )
        )
    ) 

    discoveredCo_ordinates.reverse();
    DFSDiscovered(discoveredCo_ordinates);
}









/* BFS Methods Starts here - to be encapsulated soon */



function storeTracedPath(currentVertexString)
{
    if(currentVertexString === "0")
    {
        return;
    }
    getParent = discoverParentMap[currentVertexString];
    storeTracedPath(getParent);
    tracedPath.push(currentVertexString);
}

async function retracePath(currentVertexString)
{
    storeTracedPath(currentVertexString);
    for(let i=0;i<tracedPath.length;i++)
    {
        currentElement = tracedPath[i];
        document.getElementById(currentElement).className = document.getElementById(currentElement).className.replace("discover","") + " discovered";
        await sleep(100);
    }
    isVisualizationActive = false;
    return;
}

function declareDestinationfound(destinationVertexString)
{
    tracedPath = [];
    foundEren = true;
    retracePath(destinationVertexString);   
    return;
}
function discoveradj(temp_x,temp_y,discoverindex)
{
    let currentVertexString = temp_x+"-"+temp_y;
    let leftVertexString = temp_x+"-"+(temp_y-1);
    let topVertexString = (temp_x-1)+"-"+temp_y;
    let rightVertexString = temp_x+"-"+(temp_y+1);
    let bottomVertexString = (temp_x+1)+"-"+temp_y;
    


    //left vertex
    if((temp_y-1)>0&&!document.getElementById(leftVertexString).className.includes("discover") &&!document.getElementById(leftVertexString).className.includes("wall") && !document.getElementById(leftVertexString).className.includes("source") )
    {
        discoverParentMap[leftVertexString] = currentVertexString;
        //to check if the node is destination
        if(document.getElementById(leftVertexString).className.includes("destination"))
        {
            declareDestinationfound(leftVertexString);
            return;
        }
        discoverqueue.push([temp_x,(temp_y-1),discoverindex]);
        document.getElementById(leftVertexString).className += "  discover";

    }
    //top vertex
    if((temp_x-1)>0&&!document.getElementById(topVertexString).className.includes("discover") &&!document.getElementById(topVertexString).className.includes("wall") && !document.getElementById(topVertexString).className.includes("source"))
    {
        discoverParentMap[topVertexString] = currentVertexString;
        //to check if the node is destination
        if(document.getElementById(topVertexString).className.includes("destination"))
        {
            declareDestinationfound(topVertexString);
            return;
        }
        discoverqueue.push([(temp_x-1),temp_y,discoverindex]);
       
        document.getElementById(topVertexString).className += "  discover";
    }
    //right vertex
    if((temp_y+1)<59&&!document.getElementById(rightVertexString).className.includes("discover")&&!document.getElementById(rightVertexString).className.includes("wall")&& !document.getElementById(rightVertexString).className.includes("source"))
    {
        discoverParentMap[rightVertexString] = currentVertexString;
        //to check if the node is destination
        if(document.getElementById(rightVertexString).className.includes("destination"))
        {
            declareDestinationfound(rightVertexString);
            return;
        }
        discoverqueue.push([temp_x,(temp_y+1),discoverindex]);
        
        document.getElementById(rightVertexString).className += "  discover";
    }
    //bottom vertex
    if((temp_x+1)<19&&!document.getElementById(bottomVertexString).className.includes("discover")&&!document.getElementById(bottomVertexString).className.includes("wall") && !document.getElementById(bottomVertexString).className.includes("source"))
    {
        discoverParentMap[bottomVertexString] = currentVertexString;
        //to check if the node is destination
        if(document.getElementById(bottomVertexString).className.includes("destination"))
        {
            declareDestinationfound(bottomVertexString);
            return;
        }
        discoverqueue.push([(temp_x+1),temp_y,discoverindex]);
    
        document.getElementById(bottomVertexString).className += "  discover";
    }    
}
async function discover()
{
    let discoverindex=0;
    while(1)
    {
        let temp_pointx = discoverqueue[discoverindex][0];
        let temp_pointy = discoverqueue[discoverindex][1];
        if(foundEren)
        {
            foundEren = false;
            break;
        }
        await sleep(50);
        discoveradj(temp_pointx,temp_pointy,discoverindex)
        discoverindex++;
     
    }

}
function findBFSPath()
{
   
    //to obtain co-ordinate of source from id 
    tempsource = document.getElementsByClassName("source")[0].id.split("-");
    tempsource[0] = parseInt(tempsource[0]);
    tempsource[1] = parseInt(tempsource[1]);
    //to store source co-ordinates as string
    let sourceCoOrdinateString = tempsource[0]+"-"+ tempsource[1];
    //to obtain co-ordinate of destination from id
    tempdest = document.getElementsByClassName("destination")[0].id.split("-");
    tempdest[0] = parseInt(tempdest[0]);
    tempdest[1] = parseInt(tempdest[1]);
    //to store source co-ordinates as string
    //push source vertex into queue
    discoverqueue.push([tempsource[0],tempsource[1],0]);
    //store parent of source as zero
    discoverParentMap[sourceCoOrdinateString] = "0";
    //call discover function
    discover();   
    isVisualizationActive = false;

}

function createDijkstraNode (coordniateString,weight,parent)
{
    let coordinateList = coordniateString.split("-");
    let xValue = coordinateList[0];
    let yValue = coordinateList[1];
    nodeValue = {
            "coordinateString":coordniateString,
            "xCoordinate":xValue,
            "yCoordinate":yValue,
            "weight":weight,
            "parentCoordinateString":parent
        };
    return nodeValue;
}

function isBorderCell(nodeString)
{
    if(document.getElementById(nodeString).className.includes("border"))
    {
        return true;
    }
    return false;
} 

function isDijkstraDestinationFound(currentNode)
{
    let currentNodeString = currentNode.nodeString;
    let currentNodeElement = document.getElementById(currentNodeString);
    if(currentNodeElement.className.includes("destination"))
    {
        document.getElementById(currentNode.nodeString).className += " discovered";
        destinationIterator++;
        if(destinationIterator === destinationStrings.length)
            return true;
    }
    return false;

}

async function findDjikstraPath()
{
    let destinationFound = false;
    let djUtil = new MinHeapUtil();
    let visitedList = [];
    /*
        A node consists of 
         - coOrdinates string
         - x-coordinate
         - y-coordinate
         - estimatedWeight
         - parent node coOrdinate string
    */
    let sourceElement = getSourceElement();
    let destinationElement = getDestinationElement();
    sourceCoordinateString = sourceElement.id;
    destinationCoordinateString = destinationElement.id;
    
    djUtil.processNode(sourceCoordinateString,0,"0");
    let flag= 0;
    while(!destinationFound)
    {
        //get node with least weight
        let currentNode = djUtil.removeNode();
        document.getElementById(currentNode.nodeString).className += " discover";
        await sleep(5);
        //check if destination is obtained
        destinationFound = isDijkstraDestinationFound(currentNode);
        if(destinationFound)
            break;
        let currentNodeCoordinatesList = currentNode.nodeString.split("-")
        let currentXPosition = parseInt(currentNodeCoordinatesList[0]);
        let currentYPosition = parseInt(currentNodeCoordinatesList[1]);
        //process top,right,bottom,left nodes
        let topNodeString = (currentXPosition-1)+"-"+currentYPosition;
        if(!(visitedList.includes(topNodeString) || isBorderCell(topNodeString) || document.getElementById(topNodeString).className.includes("wall")) )
        {
            let nodeWeight = userMapWeightBoard[currentXPosition-1][currentYPosition];
            djUtil.processNode(topNodeString,currentNode.nodeWeight+nodeWeight,currentNode.nodeString);
        }
        let rightNodeString = currentXPosition + "-" + (currentYPosition+1);
        if(!(visitedList.includes(rightNodeString) || isBorderCell(rightNodeString) || document.getElementById(rightNodeString).className.includes("wall")) )
        {
            let nodeWeight = userMapWeightBoard[currentXPosition][currentYPosition+1];
            djUtil.processNode(rightNodeString,currentNode.nodeWeight+nodeWeight,currentNode.nodeString);
        }
        let bottomNodeString = (currentXPosition+1) + "-" + currentYPosition;
        if(!(visitedList.includes(bottomNodeString) || isBorderCell(bottomNodeString) || document.getElementById(bottomNodeString).className.includes("wall"))  )
        {
            let nodeWeight = userMapWeightBoard[currentXPosition+1][currentYPosition];
            djUtil.processNode(bottomNodeString,currentNode.nodeWeight + nodeWeight,currentNode.nodeString);
        }
        let leftNodeString = currentXPosition + "-" + (currentYPosition-1);
        if(!(visitedList.includes(leftNodeString) || isBorderCell(leftNodeString) || document.getElementById(leftNodeString).className.includes("wall") ) )
        {
            let nodeWeight = userMapWeightBoard[currentXPosition][currentYPosition-1];
            djUtil.processNode(leftNodeString,currentNode.nodeWeight+nodeWeight,currentNode.nodeString);
        }
        visitedList.push(currentNode.nodeString);      
    }
    for(let i =0;i<destinationStrings.length;i++)
    {   
        djUtil.retracePath(destinationStrings[i]);
    }
    djUtil.retracePath(destinationCoordinateString);
    for(let i=0;i<djUtil.solutionPathList.length;i++)
    {
        if(document.getElementById(djUtil.solutionPathList[i]).className.includes("discovered"))
        {
            document.getElementById(djUtil.solutionPathList[i]).className = document.getElementById(djUtil.solutionPathList[i]).className.replace("discovered","discover");
        }
        await sleep(200);
        document.getElementById(djUtil.solutionPathList[i]).className = document.getElementById(djUtil.solutionPathList[i]).className.replace("discover","") + " discovered";
    }
    isVisualizationActive = false;   
}

function findHeuristic(currentNode,destinationNode)
{
    let currentNodeXValue = parseInt(currentNode.split("-")[0]);
    let currentNodeYValue = parseInt(currentNode.split("-")[1]);
    let destinationNodeXValue = parseInt(destinationNode.split("-")[0]);
    let destinationNodeYValue = parseInt(destinationNode.split("-")[1]);
    
    return (Math.abs(currentNodeXValue - destinationNodeXValue) + Math.abs(currentNodeYValue - destinationNodeYValue));
}


async function aStarSearchPath()
{
    /*
        fetch source and destination nodes
        push source node into minheap with heuristic calculated using findHeuristic function
        generate successor nodes and insert them into the heap using heuristic value
    */ 
        let destinationFound = false;
        let aStarUtil = new MinHeapUtil();
        let visitedList = [];
        /*
            A node consists of 
             - coOrdinates string
             - x-coordinate
             - y-coordinate
             - estimatedWeight
             - parent node coOrdinate string
        */
       let sourceElement = getSourceElement();
       let destinationElement = getDestinationElement();
        sourceCoordinateString = sourceElement.id;
        destinationCoordinateString = destinationElement.id;
        
        aStarUtil.processNode(sourceCoordinateString,0,"0");
        let flag= 0;
        while(!destinationFound)
        {
            //get node with least weight
            let currentNode = aStarUtil.removeNode();
            document.getElementById(currentNode.nodeString).className += " discover";
            await sleep(5);
            //check if destination is obtained
            let currentNodeElement = document.getElementById(currentNode.nodeString);
            if( currentNodeElement.className.includes("destination"))
                break;
            let currentNodeCoordinatesList = currentNode.nodeString.split("-")
            let currentXPosition = parseInt(currentNodeCoordinatesList[0]);
            let currentYPosition = parseInt(currentNodeCoordinatesList[1]);
            //process top,right,bottom,left nodes
            let topNodeString = (currentXPosition-1)+"-"+currentYPosition;
            if(!(visitedList.includes(topNodeString) || isBorderCell(topNodeString) || document.getElementById(topNodeString).className.includes("wall")) )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition-1][currentYPosition];
                let topNodeHeuristicValue = findHeuristic(topNodeString,destinationCoordinateString);
                aStarUtil.processNode(topNodeString,currentNode.nodeWeight + topNodeHeuristicValue+nodeWeight,currentNode.nodeString);
            }
            let rightNodeString = currentXPosition + "-" + (currentYPosition+1);
            if(!(visitedList.includes(rightNodeString) || isBorderCell(rightNodeString) || document.getElementById(rightNodeString).className.includes("wall")) )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition][currentYPosition+1];
                let rightNodeHeuristicValue = findHeuristic(rightNodeString,destinationCoordinateString);
                aStarUtil.processNode(rightNodeString,currentNode.nodeWeight + rightNodeHeuristicValue+nodeWeight,currentNode.nodeString);
            }
            let bottomNodeString = (currentXPosition+1) + "-" + currentYPosition;
            if(!(visitedList.includes(bottomNodeString) || isBorderCell(bottomNodeString) || document.getElementById(bottomNodeString).className.includes("wall"))  )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition+1][currentYPosition];
                let bottomNodeHeuristicValue = findHeuristic(bottomNodeString,destinationCoordinateString);
                aStarUtil.processNode(bottomNodeString,currentNode.nodeWeight + bottomNodeHeuristicValue + nodeWeight,currentNode.nodeString);
            }
            let leftNodeString = currentXPosition + "-" + (currentYPosition-1);
            if(!(visitedList.includes(leftNodeString) || isBorderCell(leftNodeString) || document.getElementById(leftNodeString).className.includes("wall") ) )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition][currentYPosition-1];
                let leftNodeHeuristicValue = findHeuristic(leftNodeString,destinationCoordinateString);
                aStarUtil.processNode(leftNodeString,currentNode.nodeWeight + leftNodeHeuristicValue+nodeWeight,currentNode.nodeString);
            }
            visitedList.push(currentNode.nodeString);
          
        }
        aStarUtil.retracePath(destinationCoordinateString);
        for(let i=0;i<aStarUtil.solutionPathList.length;i++)
        {
            if(document.getElementById(aStarUtil.solutionPathList[i]).className.includes("discovered"))
            {
                document.getElementById(aStarUtil.solutionPathList[i]).className = document.getElementById(aStarUtil.solutionPathList[i]).className.replace("discovered","discover");
            }
            await sleep(200);
            document.getElementById(aStarUtil.solutionPathList[i]).className = document.getElementById(aStarUtil.solutionPathList[i]).className.replace("discover","") + " discovered";
        }
        isVisualizationActive = false;
}

async function findBestFirstSearchPath()
{
    /*
        fetch source and destination nodes
        push source node into minheap with heuristic calculated using findHeuristic function
        generate successor nodes and insert them into the heap using heuristic value
    */ 
        let destinationFound = false;
        let bestFirstSearchUtil = new MinHeapUtil();
        let visitedList = [];
        /*
            A node consists of 
             - coOrdinates string
             - x-coordinate
             - y-coordinate
             - estimatedWeight
             - parent node coOrdinate string
        */
        let sourceElement = getSourceElement();
        let destinationElement = getDestinationElement();
        sourceCoordinateString = sourceElement.id;
        destinationCoordinateString = destinationElement.id;
        
        bestFirstSearchUtil.processNode(sourceCoordinateString,0,"0");
        let flag= 0;
        while(!destinationFound)
        {
            //get node with least weight
            let currentNode = bestFirstSearchUtil.removeNode();
            document.getElementById(currentNode.nodeString).className += " discover";
            await sleep(5);
            //check if destination is obtained
            let currentNodeElement = document.getElementById(currentNode.nodeString);
            if( currentNodeElement.className.includes("destination"))
                break;
            let currentNodeCoordinatesList = currentNode.nodeString.split("-")
            let currentXPosition = parseInt(currentNodeCoordinatesList[0]);
            let currentYPosition = parseInt(currentNodeCoordinatesList[1]);
            //process top,right,bottom,left nodes
            let topNodeString = (currentXPosition-1)+"-"+currentYPosition;
            if(!(visitedList.includes(topNodeString) || isBorderCell(topNodeString) || document.getElementById(topNodeString).className.includes("wall")) )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition-1][currentYPosition];
                let topNodeHeuristicValue = findHeuristic(topNodeString,destinationCoordinateString);
                bestFirstSearchUtil.processNode(topNodeString,topNodeHeuristicValue+nodeWeight,currentNode.nodeString);
            }
            let rightNodeString = currentXPosition + "-" + (currentYPosition+1);
            if(!(visitedList.includes(rightNodeString) || isBorderCell(rightNodeString) || document.getElementById(rightNodeString).className.includes("wall")) )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition][currentYPosition+1];
                let rightNodeHeuristicValue = findHeuristic(rightNodeString,destinationCoordinateString);
                bestFirstSearchUtil.processNode(rightNodeString,rightNodeHeuristicValue+nodeWeight,currentNode.nodeString);
            }
            let bottomNodeString = (currentXPosition+1) + "-" + currentYPosition;
            if(!(visitedList.includes(bottomNodeString) || isBorderCell(bottomNodeString) || document.getElementById(bottomNodeString).className.includes("wall"))  )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition+1][currentYPosition];
                let bottomNodeHeuristicValue = findHeuristic(bottomNodeString,destinationCoordinateString);
                bestFirstSearchUtil.processNode(bottomNodeString,bottomNodeHeuristicValue + nodeWeight,currentNode.nodeString);
            }
            let leftNodeString = currentXPosition + "-" + (currentYPosition-1);
            if(!(visitedList.includes(leftNodeString) || isBorderCell(leftNodeString) || document.getElementById(leftNodeString).className.includes("wall") ) )
            {
                let nodeWeight = userMapWeightBoard[currentXPosition][currentYPosition-1];
                let leftNodeHeuristicValue = findHeuristic(leftNodeString,destinationCoordinateString);
                bestFirstSearchUtil.processNode(leftNodeString,leftNodeHeuristicValue+nodeWeight,currentNode.nodeString);
            }
            visitedList.push(currentNode.nodeString);
          
        }
        bestFirstSearchUtil.retracePath(destinationCoordinateString);
        for(let i=0;i<bestFirstSearchUtil.solutionPathList.length;i++)
        {
            if(document.getElementById(bestFirstSearchUtil.solutionPathList[i]).className.includes("discovered"))
            {
                document.getElementById(bestFirstSearchUtil.solutionPathList[i]).className = document.getElementById(bestFirstSearchUtil.solutionPathList[i]).className.replace("discovered","discover");
            }
            await sleep(200);
            document.getElementById(bestFirstSearchUtil.solutionPathList[i]).className = document.getElementById(bestFirstSearchUtil.solutionPathList[i]).className.replace("discover","") + " discovered";
        }
        isVisualizationActive = false;
}

function visualise()
{
    if(!isVisualizationActive && isSourceDestinationDefined() )
    {
        isVisualizationActive = true;
        getPathFindingAlgo = document.getElementById("algoSelector").value;
        if(getPathFindingAlgo === "DFS")
        {
            findDFSPath();
        }
        else if(getPathFindingAlgo === "BFS")
        {
            findBFSPath();
        } 
        else if(getPathFindingAlgo === "DIJKSTRA")
        {
            findDjikstraPath();
        }
        else if(getPathFindingAlgo === "BESTFIRSTSEARCH")
        {
            findBestFirstSearchPath();
        }
        else if( getPathFindingAlgo === "ASTAR")
        {
            aStarSearchPath();
        }
        else{
            alert("Please Select an Algorithm");
        }
    }
}

window.onload = () =>
{
    clearBoard();
    initialiseUserMapWeightBoard();
}



