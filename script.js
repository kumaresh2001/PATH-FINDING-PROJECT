//source var and destinationvar used to activate selecting source and destination
var sourcevar=0,destinationvar=0,sourceclass="",destinationclass="";
var directionArray = [[0,-1],[0,1],[-1,0],[1,0]],directionPointer=0;
var isVisualizationActive = false;
var discoveredCo_ordinates = new Array();
var ij=0;
//declaration and initialisation of board
var board = new Array(20);
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
console.log(board);
/*
board looks like this
-1 -1 -1 -1 -1 -1 -1 -1
-1  0  0  0  0  0  0 -1
-1  0  0  0  0  0  0 -1
-1  0  0  0  0  0  0 -1
-1  0  0  0  0  0  0 -1
-1  0  0  0  0  0  0 -1
-1  0  0  0  0  0  0 -1
-1 -1 -1 -1 -1 -1 -1 -1
*/


function source()
{
    if(!isVisualizationActive)
    {
        sourcevar=1;
        destinationvar =0;    
    }
}
function destination()
{
    if(!isVisualizationActive)
    {
        sourcevar = 0;
        destinationvar=1;    
    }
}
function mark(i,j)
{
    if(!isVisualizationActive)
    {
        if(i==0||i==19||j==0||j==59)
        {
            alert("CHOOSE EMPTY SPACE");
            return;
        }
        if(sourcevar==1)
        {
            var x = document.getElementsByClassName("source");
            //resetting previously set source
            if(typeof(x[0])!="undefined")
            {
                var oldSourceId= x[0].id;
                var i1 = oldSourceId.split("-");
                console.log(i1[0]+"--"+i1[1])
                x[0].innerHTML = "";
                x[0].className = sourceclass;
                board[i1[0]][i1[1]] = 0;
            }
            //setting new source
            sourceclass=document.getElementById(i+"-"+j).className;
            document.getElementById(i+"-"+j).className +=" source";
            document.getElementById(i+"-"+j).innerHTML = "S";
            board[i][j] = 1;
            sourcevar=0;
            //indicating that source marking is complete
        }
        else if(destinationvar==1)
        {
            var y = document.getElementsByClassName("destination");
            //resetting previously set destination
            if(typeof(y[0])!="undefined")
            {
                var oldDestinationId = y[0].id;
                var j1 = oldDestinationId.split("-");
                console.log(j1[0]+"---"+j1[1]);
                console.log("entered if");
                y[0].innerHTML = "";
                y[0].className = destinationclass;
                board[j1[0]][j1[1]] = 0;
            }
            //setting new destination
            destinationclass=document.getElementById(i+"-"+j).className;
            document.getElementById(i+"-"+j).className +=" destination";
            document.getElementById(i+"-"+j).innerHTML = "D";
            board[i][j] = 2;
            destinationvar=0;
            //indicating that destination making is complete
        }
        else{
            alert("PLEASE SELECT AN OPTION");
        }
    
    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }

function discover(x,y)
{
        
        if(x<=0||x>=19||y<=0||y>=59)
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
        
        
        if(discover(x-1,y))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        if(discover(x,y+1))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        if(discover(x+1,y))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        if(discover(x,y-1))
        {
            discoveredCo_ordinates.push([x,y]);
            return 1;
        }
        
    
        return 0;
}

async function discovered(discoveredCo_ordinates)
{
    for(var ij=0;ij<discoveredCo_ordinates.length;ij++)
    {
        await sleep(50);
        document.getElementById(discoveredCo_ordinates[ij][0]+"-"+discoveredCo_ordinates[ij][1]).className+=" discovered";
    }
}
 function findPath()
{
    isVisualizationActive = true;
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
    discover(parseInt(sourceIndex[0])-1,parseInt(sourceIndex[1])) ? "": (discover(parseInt(sourceIndex[0]),parseInt(sourceIndex[1])+1) ? "" : (discover(parseInt(sourceIndex[0])+1,parseInt(sourceIndex[1])) ? "" : discover(parseInt(sourceIndex[0]),parseInt(sourceIndex[1])-1) ));
    discoveredCo_ordinates.reverse();
    console.log(discoveredCo_ordinates);
    discovered(discoveredCo_ordinates);
    isVisualizationActive = false;
}
