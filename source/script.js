var sourcevar=0,destinationvar=0,sourceclassname="",destinationclassname="",tempdest,tempsource,discoverqueue=[],discoverParentMap = {},foundEren=false,tracedPath=[];
//source var and destinationvar used to activate selecting source and destination
var directionArray = [[0,-1],[0,1],[-1,0],[1,0]],directionPointer=0;
var discoveredCo_ordinates = new Array();
var ij=0;
var isVisualizationActive = false;
//declaration and initialisation of board
var board = new Array(20);
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
                board[i][j] = 0;
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
}

function resetMap()
{
    if(!isVisualizationActive)
    {
        clearBoard();
        clearMap();    
    }
}

//to let mark function know we have to mark source
function source()
{
    if(!isVisualizationActive)
    {
        sourcevar=1;
        destinationvar=0;    
    }
}
function destination()
{
    if(!isVisualizationActive)
    {
        destinationvar=1;
        sourcevar=0;    
    }
}

function mark(i,j)
{
    if(!isVisualizationActive)
    {
        //to see if we have to mark source
        if(sourcevar==1)
        {
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
        else if(destinationvar==1)
        {
            var prevdestination = document.getElementsByClassName("destination");
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
            return;
        }

    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


/* DFS Methods Starts here - to be encapsulated soon */
function DFSDiscover(x,y)
{
        
        if(x<=0||x>=19||y<=0||y>=59)
        {
            return 0;
        }
        console.log(x+"-"+y);
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
    //check if source exists
    var x = document.getElementsByClassName("source");
    if(typeof(x[0])=="undefined")
    {
        alert("SELECT SOURCE");
        return;
    }
    //check if destination exists
    var y = document.getElementsByClassName("destination");
    if(typeof(y[0])=="undefined")
    {
        alert("SELECT DESTINATION");
        return;
    }
    let sourceIndex = x[0].id.split("-");    
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
    let rightVertexString = (temp_x+1)+"-"+temp_y;
    let bottomVertexString = temp_x+"-"+(temp_y+1);  



    //left vertex
    if((temp_y-1)>0&&!document.getElementById(leftVertexString).className.includes("discover") && !document.getElementById(leftVertexString).className.includes("source") )
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
    if((temp_x-1)>0&&!document.getElementById(topVertexString).className.includes("discover")&& !document.getElementById(topVertexString).className.includes("source"))
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
    if((temp_y+1)<59&&!document.getElementById(bottomVertexString).className.includes("discover")&& !document.getElementById(bottomVertexString).className.includes("source"))
    {
        discoverParentMap[bottomVertexString] = currentVertexString;
        //to check if the node is destination
        if(document.getElementById(bottomVertexString).className.includes("destination"))
        {
            declareDestinationfound(bottomVertexString);
            return;
        }
        discoverqueue.push([temp_x,(temp_y+1),discoverindex]);
    
        document.getElementById(bottomVertexString).className += "  discover";
    }
    
    //bottom vertex
    if((temp_x+1)<19&&!document.getElementById(rightVertexString).className.includes("discover")&& !document.getElementById(rightVertexString).className.includes("source"))
    {
        discoverParentMap[rightVertexString] = currentVertexString;
        //to check if the node is destination
        if(document.getElementById(rightVertexString).className.includes("destination"))
        {
            declareDestinationfound(rightVertexString);
            return;
        }
        discoverqueue.push([(temp_x+1),temp_y,discoverindex]);
        
        document.getElementById(rightVertexString).className += "  discover";
    }
}
async function discover()
{
    let discoverindex=0;
    while(1)
    {
        console.log(discoverindex);
        await sleep(40);
        let temp_pointx = discoverqueue[discoverindex][0];
        let temp_pointy = discoverqueue[discoverindex][1];
        console.log(temp_pointx + " - " + temp_pointy);
        if(foundEren)
        {
            foundEren = false;
            break;
        }
        discoveradj(temp_pointx,temp_pointy,discoverindex)
        discoverindex++;
     
    }

}
function findPath()
{
    var x = document.getElementsByClassName("source");
    if(typeof(x[0])==="undefined")
    {
        alert("Select a Source");
        return;
    }
    var y = document.getElementsByClassName("destination");
    if(typeof(y[0])==="undefined")
    {
        alert("Select a Destination");
        return;
    }
    //to obtain co-ordinate of source from id 
    tempsource = x[0].id.split("-");
    tempsource[0] = parseInt(tempsource[0]);
    tempsource[1] = parseInt(tempsource[1]);
    //to store source co-ordinates as string
    let sourceCoOrdinateString = tempsource[0]+"-"+ tempsource[1];
    //to obtain co-ordinate of destination from id
    tempdest = y[0].id.split("-");
    tempdest[0] = parseInt(tempdest[0]);
    tempdest[1] = parseInt(tempdest[1]);
    //to store source co-ordinates as string
    discoverqueue = [];
    discoverParentMap ={};    
    //push source vertex into queue
    discoverqueue.push([tempsource[0],tempsource[1],0]);
    //store parent of source as zero
    discoverParentMap[sourceCoOrdinateString] = "0";
    //call discover function
    discover();   
    isVisualizationActive = false;

}

function visualise()
{
    if(!isVisualizationActive)
    {
        isVisualizationActive = true;
        getPathFindingAlgo = document.getElementById("algoSelector").value;
        if(getPathFindingAlgo === "DFS")
        {
            findDFSPath();
        }
        else if(getPathFindingAlgo === "BFS")
        {
            findPath();
        } 
    }
}

window.onload = () =>
{
    clearBoard();
}
