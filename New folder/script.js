var sourcevar=0,destinationvar=0,sourceclassname="",destinationclassname="",tempdest,tempsource,discoverqueue=[],discoverParentMap = {},foundEren=false;
//to let mark function know we have to mark source
function source()
{
    sourcevar=1;
    destinationvar=0;
}
function destination()
{
    destinationvar=1;
    sourcevar=0;
}

function mark(i,j)
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
        x.innerHTML = "S";
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
        x.innerHTML = "D";
        return;
    }

}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
 }
async function retracePath(currentVertexString)
{
    console.log(discoverParentMap);
    if(currentVertexString === "0")
    {
        console.log(discoverParentMap);
        return;
    }
    await sleep(100);
    getParentElement = discoverParentMap[currentVertexString];
    retracePath(getParentElement);
    document.getElementById(currentVertexString).style.backgroundColor = "green";
}
function declareDestinationfound(destinationVertexString)
{
    foundEren = true;
    document.getElementById(destinationVertexString).className += "  destinationFound";
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
    let dummy=0;
    while(1)
    {
        await sleep(25);
        let temp_pointx = discoverqueue[discoverindex][0];
        let temp_pointy = discoverqueue[discoverindex][1];
        if(foundEren)
        {
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
        alert("PLEASE SELECT SOURCE");
        return;
    }
    var y = document.getElementsByClassName("destination");
    if(typeof(y[0])==="undefined")
    {
        alert("PLEASE SELECT DESTINATION");
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
    let destinationCoOrdinateString = tempdest[0]+"-"+ tempdest[1];
    
    //push source vertex into queue
    discoverqueue.push([tempsource[0],tempsource[1],0]);
    //store parent of source as zero
    discoverParentMap[sourceCoOrdinateString] = "0";
    //call discover function
    discover();   

}
    
