// src/lib/PriorityQueue.ts
type QueueElement<T> = {
    item: T;
    priority: number;
  };
  
  export class PriorityQueue<T = any> {
    private items: QueueElement<T>[] = [];
  
    enqueue(item: T, priority: number): void {
      const queueElement: QueueElement<T> = { item, priority };
      let added = false;
  
      for (let i = 0; i < this.items.length; i++) {
        if (queueElement.priority < this.items[i].priority) {
          this.items.splice(i, 0, queueElement);
          added = true;
          break;
        }
      }
  
      if (!added) {
        this.items.push(queueElement);
      }
    }
  
    dequeue(): T | null {
      const element = this.items.shift();
      return element ? element.item : null;
    }
  
    front(): T | null {
      return this.items.length > 0 ? this.items[0].item : null;
    }
  
    isEmpty(): boolean {
      return this.items.length === 0;
    }
  
    size(): number {
      return this.items.length;
    }
  
    getAllItems(): T[] {
      return this.items.map(element => element.item);
    }
  
    clear(): void {
      this.items = [];
    }
  }