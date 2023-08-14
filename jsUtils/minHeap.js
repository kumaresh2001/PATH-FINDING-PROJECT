class minHeap{
    heap = [];
    nodePositions = {};
    isEmpty = () =>
    {
        return this.heap.length === 0 ? true :false;
    }
    selectMinNodeIndex = (left,right) =>
    {
        right < this.heap.length    ?
        (
            this.heap[left].weight < this.heap[right].weight  ?
            (
                left
            )
            :   right
        )
        :   left;
    }
    addNode = (value) =>
    {
        this.heap.push(value);
        let currIndex = heap.length-1;
        while(currIndex !=0)
        {
            let currNode = heap[currIndex];
            parentIndex = (currIndex -1 )/2;
            let parentNode = heap[parentIndex];
            if(currNode.weight < parentNode.weight)
            {
                this.heap[currIndex] = parentNode;
                this.heap[parentNode] = currNode;  
                this.nodePositions[this.heap[parentIndex].coordinateString] = currentIndex;
                this.nodePositions[this.heap[currentIndex].coordinateString] = parentIndex;
                currentIndex = parentIndex;
            }
            else
            {
                break;
            }
        }
        this.nodePositions[value.coordinateString] = currentIndex;
        return currentIndex;
    }
    removeNode = () =>
    {
        if(!isEmpty())
        {
            let nodeToBeReturned = heap[0];
            this.heap[0] = heap[this.heap.length -1];
            this.heap.pop();
            let currentIndex = 0;
            while(currentIndex < this.heap.length-2)
            {
                let leftNodeIndex = ((currentIndex*2)+1), rightNodeIndex = ((currentIndex*2)+2);
                let minNodeIndex = this.selectMinNodeIndex(leftNodeIndex,rightNodeIndex);
                if(this.heap[currentIndex].weight > this.heap[minNodeIndex].weight )
                {
                    let tempNode = this.heap[currentIndex];
                    this.heap[currentIndex] = this.heap[minNodeIndex];
                    this.heap[minNodeIndex] = tempNode;
                    this.nodePositions[this.heap[minNodeIndex].coordinateString] = currentIndex;
                    this.nodePositions[this.heap[currentIndex].coordinateString] = minNodeIndex;
                    currentIndex = minNodeIndex;
                }
                else
                {
                    break;
                }
            }
            this.nodePositions[nodeToBeReturned.coordinateString] = null;
            return nodeToBeReturned;
        }
    }
    reArrangeNode = (nodeIndex) =>
    {
        if(!this.isEmpty && nodeIndex < this.heap.length)
        {
           let currentIndex = nodeIndex;
           while(currentIndex > 0)
           {
                let parentIndex = (currentIndex-1)/2;
                if(this.heap[parentIndex].weight > this.heap[currentIndex].weight)
                {
                    let tempNode = this.heap[currentIndex];
                    this.heap[currentIndex] = this.heap[parentIndex];
                    this.heap[parentIndex] = tempNode;
                    this.nodePositions[this.heap[parentIndex].coordinateString] = currentIndex;
                    this.nodePositions[this.heap[currentIndex].coordinateString] = parentIndex;
                    currentIndex = parentIndex;
                }
                else
                {
                    break;
                }
           }
        }
    }
    updateNewPosition = () =>
    {
        for(let i =this.heap.length-1;i>0;i--)
        {
            this.reArrangeNode(i);   
        }
    }

}

