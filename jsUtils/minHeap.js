createNodeObject = (nodeString,nodeWeight) =>
{
    return {
        "nodeString":nodeString,
        "nodeWeight":nodeWeight
    }
}
class MinHeap
{
    /*
        This heap shall be used to store the estimated weights of nodes
        And a Map is used to store the position of the node in the heap    
    */
   heap = [];
   nodePositions = {};

   isHeapEmpty = () =>
   {
        this.heap.length === 0 ? true : false;
   }
   
   checkHeapNodeExists = (nodeString) =>
   {
        this.nodePositions[nodeString] != null ? true : false;
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
        let nodeObject = createNodeObject(nodeString,nodeWeight);
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
   removeNode = () =>
   {
        let nodeToBeRemoved = this.heap[0];
        this.heap[0] = this.heap[this.heap.length-1];
        this.heap.pop();
        let currIndex = 0;
        while((currIndex*2)+1 < this.heap.length)
        {
            let minChildNodeIndex = getMinNode((currIndex*2)+1,(currIndex*2)+2);
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