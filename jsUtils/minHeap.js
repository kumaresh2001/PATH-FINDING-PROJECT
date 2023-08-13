class minHeap{
    heap = [];
    isEmpty = () =>
    {
        return this.heap.length === 0 ? true :false;
    }
    selectMinNodeIndex = (left,right) =>
    {
        right < this.heap.length    ?
        (
            this.heap[left] < this.heap[right]  ?
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
            if(currNode < parentNode)
            {
                this.heap[currIndex] = parentNode;
                this.heap[parentNode] = currNode;  
            }
            currentIndex = parentIndex;
        }
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
                if(this.heap[currentIndex] > this.heap[minNodeIndex] )
                {
                    let tempNode = this.heap[currentIndex];
                    this.heap[currentIndex] = this.heap[parentIndex];
                    this.heap[parentIndex] = tempNode;
                }
                currentIndex = minNodeIndex;
            }
            return nodeToBeReturned;
        }
    }
}