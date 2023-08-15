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

   insertNode = (nodeString,nodeWeight) =>
   {    
        let currIndex = this.heap.length;
        this.heap[currIndex] = nodeWeight;
        while(currIndex > 0)
        {
            let parentIndex = Math.floor((currIndex-1)/2);
            if(this.heap[currIndex] < this.heap[parentIndex])
            {
                let temp = this.heap[parentIndex];
                this.heap[parentIndex] = this.heap[currIndex];
                this.heap[currIndex] = temp;
                
            }
        }


   }
}