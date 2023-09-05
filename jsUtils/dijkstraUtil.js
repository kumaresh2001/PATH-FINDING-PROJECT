class DijkstraUtil
{
    //data members
    nodePositions = {};
    parentMap = {};
    minHeap = [];
    solutionPathList = [];
    
    //memberFunctions
    retracePath = (nodeString) => {
        if(nodeString!="0")
        {
            this.retracePath(this.parentMap[nodeString]);
            this.solutionPathList.push(nodeString);
        }
    }

    //heap functions
    isHeapEmpty = () =>
    {
         this.minHeap.length === 0 ? true : false;
    }
    
    checkHeapNodeExists = (nodeString) =>
    {
         this.nodePositions[nodeString] != null ? true : false;
    }
    
    createHeapNode = (nodeString,nodeWeight) => {
        return {
            "nodeString":nodeString,
            "nodeWeight":nodeWeight
        };
    }

    

    getMinNode = (left,right) =>
    {
        return right >= this.minHeap.length 
                ? 
                left:
                (
                    this.minHeap[left].nodeWeight <= this.minHeap[right].nodeWeight 
                    ? 
                    left : 
                    right 
                );
    }

    insertNode = (nodeString,nodeWeight) =>
    {
        let nodeObject = this.createHeapNode(nodeString,nodeWeight);
        let currIndex = this.minHeap.length;
        this.minHeap[currIndex] = nodeObject;
        this.nodePositions[nodeString] = currIndex; 
        while(currIndex > 0)
        {
            let parentIndex = Math.floor((currIndex-1)/2);
            if(this.minHeap[currIndex].nodeWeight < this.minHeap[parentIndex].nodeWeight)
            {
                let temp = this.minHeap[parentIndex];
                this.minHeap[parentIndex] = this.minHeap[currIndex];
                this.minHeap[currIndex] = temp;
                //set positions of parent and child
                let parentNodeString = this.minHeap[currIndex].nodeString;
                this.nodePositions[parentNodeString] = currIndex;
                this.nodePositions[this.minHeap[currIndex].nodeString] = parentIndex;
                currIndex = parentIndex;
            }
            else{
                break;
            }
        }
    }

    updateNode = (nodeString,nodeWeight) => 
    {
        let nodeIndex = this.nodePositions[nodeString];
        this.minHeap[nodeIndex].nodeWeight = nodeWeight;
        let currIndex = nodeIndex;
        while(currIndex > 0)
        {
            let parentIndex = Math.floor((currIndex-1)/2);

            if(this.minHeap[parentIndex].nodeWeight > this.minHeap[currIndex].nodeWeight)
            {
                let currentNode = this.minHeap[currIndex];
                let parentNode = this.minHeap[parentIndex];
                this.minHeap[parentIndex] = currentNode;
                this.minHeap[currIndex] = parentNode;
                this.nodePositions[parentNode.nodeString] = currIndex;
                this.nodePositions[currentNode.nodeString] = parentIndex;
                currIndex = parentIndex;
            }
            else
                break;
        }
    }

    processNode(nodeString,nodeWeight,parentString)
    {
        //check if the node already exists
        if(this.nodePositions[nodeString]!= null)
        {
            let currentNodeIndex = this.nodePositions[nodeString];
            console.log(this.nodePositions)
            console.log("currentNodeIndex" + currentNodeIndex);
            let currentNode = this.minHeap[currentNodeIndex];
            if(currentNode.nodeWeight > nodeWeight)
            {
                this.updateNode(nodeString,nodeWeight);
                this.parentMap[nodeString] = parentString;
            }
        }
        else
        {
            this.insertNode(nodeString,nodeWeight);
            this.parentMap[nodeString] = parentString;
        }
    }

    removeNode = () =>
   {
        let nodeToBeRemoved = this.minHeap[0];
        let lastindexNode = this.minHeap[this.minHeap.length-1];
        this.minHeap[0] = lastindexNode;
        this.nodePositions[lastindexNode.nodeString] = 0;
        this.minHeap.pop();
        //delete node from nodePositions
        let nodeString = nodeToBeRemoved.nodeString;
        delete this.nodePositions[nodeString];
        let currIndex = 0,minChildNodeIndex =0;
        while(minChildNodeIndex < this.minHeap.length)
        {
            minChildNodeIndex = this.getMinNode((currIndex*2)+1,(currIndex*2)+2);
            if(minChildNodeIndex >= this.minHeap.length)
                break;
            console.log("current Node Index - " + currIndex + "\n Min Node Index - " + minChildNodeIndex);
            console.log([...this.minHeap]);
            console.log({...this.nodePositions});
            if(this.minHeap[currIndex].nodeWeight > this.minHeap[minChildNodeIndex].nodeWeight )
            {
                let minNode = this.minHeap[minChildNodeIndex];
                let currentNode = this.minHeap[currIndex];
                this.minHeap[currIndex] = this.minHeap[minChildNodeIndex];
                this.minHeap[minChildNodeIndex] = currentNode;
                // set positions of parent and child
                this.nodePositions[currentNode.nodeString] = currIndex;
                this.nodePositions[minNode.nodeString] = minChildNodeIndex;
                currIndex = minChildNodeIndex;
            }
            else{
                break;
            }
        }
        return nodeToBeRemoved;

   }

}