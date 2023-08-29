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
        this.minHeap[nodeIndex],nodeWeight = nodeWeight;
        let currIndex = nodeIndex;
        while(currIndex > 0)
        {
            let parentIndex = Math.floor((currIndex-1)*2);
            console.log("parent Index - " + parentIndex);
            if(this.minHeap[parentIndex].nodeWeight > this.minHeap[currIndex].nodeWeight)
            {
                let tempNode = this.minHeap[parentIndex];
                this.minHeap[parentIndex] = this.minHeap[currIndex];
                this.minHeap[currIndex] = tempNode;
                this.nodePositions[this.minHeap[parentIndex].nodeString] = currIndex;
                this.nodePositions[this.minHeap[currIndex].nodeString] = parentIndex;
                currIndex = parentIndex;
            }
        }
    }

    processNode(nodeString,nodeWeight,parentString)
    {
        //check if the node already exists
        if(this.nodePositions[nodeString]!= null)
        {

            let currentNodeIndex = this.nodePositions[nodeString];
            let currentNode = this.minHeap[currentNodeIndex];
            console.log(currentNodeIndex + "- Node -> " + currentNode);
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
        let currIndex = 0;
        while((currIndex*2)+1 < this.minHeap.length)
        {
            let minChildNodeIndex = this.getMinNode((currIndex*2)+1,(currIndex*2)+2);
            if(this.minHeap[currIndex].nodeWeight > this.minHeap[minChildNodeIndex].nodeWeight )
            {
                let tempNode = this.minHeap[currIndex];
                this.minHeap[currIndex] = this.minHeap[minChildNodeIndex];
                this.minHeap[minChildNodeIndex] = tempNode;
                // set positions of parent and child
                let minNodeString = this.minHeap[currIndex].nodeString;
                this.nodePositions[minNodeString] = currIndex;
                this.nodePositions[this.minHeap[minChildNodeIndex].nodeString] = minChildNodeIndex;
                currIndex = minChildNodeIndex;
            }
            else{
                break;
            }
        }
        return nodeToBeRemoved;

   }

}