class DijkstraUtil
{
    //data members
    nodePositions = {};
    parentMap = {};
    minHeap = [];
    
    //memberFunctions
    retracePath = (nodeString) => {
        while(this.parentMap[nodeString]!= null || this.parentMap[nodeString] != "0")
        {
            currentElement = document.getElementById(nodeString).id;
            console.log(currentElement);
            nodeString = parentmap[nodeString];
        }
    }

    //heap functions
    isHeapEmpty = () =>
    {
         this.heap.length === 0 ? true : false;
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
        return right >= this.heap.length 
                ? 
                left:
                (
                    this.heap[left].nodeWeight <= this.heap[right].nodeWeight 
                    ? 
                    left : 
                    right 
                );
    }

    insertNode = (nodeString,nodeWeight) =>
    {
        let nodeObject = this.createNodeObject(nodeString,nodeWeight);
        let currIndex = this.heap.length;
        this.heap[currIndex] = nodeObject;
        this.nodePositions[this.nodePositions.nodeString] = currIndex; 
        while(currIndex > 0)
        {
            let parentIndex = Math.floor((currIndex-1)/2);
            if(this.heap[currIndex].nodeWeight < this.heap[parentIndex].nodeWeight)
            {
                let temp = this.heap[parentIndex];
                this.heap[parentIndex] = this.heap[currIndex];
                this.heap[currIndex] = temp;
                //set positions of parent and child
                let parentNodeString = this.heap[currIndex].nodeString;
                this.nodePositions[parentNodeString] = currIndex;
                this.nodePositions[this.heap[currIndex].nodeString] = parentIndex;
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
        this.heap[nodeIndex],nodeWeight = nodeWeight;
        let currIndex = nodeIndex;
        while(currIndex > 0)
        {
            let parentIndex = Math.floor((currIndex-1)*2);
            if(this.heap[parentIndex].nodeWeight > this.heap[currIndex].nodeWeight)
            {
                let tempNode = this.heap[parentIndex];
                this.heap[parentIndex] = this.heap[currIndex];
                this.heap[currIndex] = tempNode;
                this.nodePositions[this.heap[parentIndex].nodeString] = currIndex;
                this.nodePositions[this.heap[currIndex].nodeString] = parentIndex;
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
            let currentNode = this.heap[currentNodeIndex];
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
        let nodeToBeRemoved = this.heap[0];
        this.heap[0] = this.heap[this.heap.length-1];
        this.heap.pop();
        let currIndex = 0;
        while((currIndex*2)+1 < this.heap.length)
        {
            let minChildNodeIndex = this.getMinNode((currIndex*2)+1,(currIndex*2)+2);
            if(this.heap[currIndex].nodeWeight > this.heap[minChildNodeIndex].nodeWeight )
            {
                let tempNode = this.heap[currIndex];
                this.heap[currIndex] = this.heap[minChildNodeIndex];
                this.heap[minChildNodeIndex] = tempNode;
                // set positions of parent and child
                let minNodeString = this.heap[currIndex].nodeString;
                this.nodePositions[minNodeString] = currIndex;
                this.nodePositions[this.heap[currIndex].nodeString] = minChildNodeIndex;
                currIndex = minChildNodeIndex;
            }
            else{
                break;
            }
        }
        return nodeToBeRemoved;

   }

}