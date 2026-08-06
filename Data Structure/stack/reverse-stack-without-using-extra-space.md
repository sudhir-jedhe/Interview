// Input : 1->2->3->4
// Output : 4->3->2->1

// Input :  6->5->4
// Output : 4->5->6

// JavaScript program to implement Stack
// using linked list so that reverse can
// be done with O(1) extra space.
class StackNode {
  constructor(data) {
    this.data = data;
    this.next = null;
  }
}

class Stack {
  top = null;

  // Push and pop operations
  push(data) {
    if (this.top == null) {
      this.top = new StackNode(data);
      return;
    }
    var s = new StackNode(data);
    s.next = this.top;
    this.top = s;
  }

  pop() {
    var s = this.top;
    this.top = this.top.next;
    return s;
  }

  // Prints contents of stack
  display() {
    var s = this.top;
    while (s != null) {
      document.write(s.data + " ");
      s = s.next;
    }
    document.write("<br>");
  }

  // Reverses the stack using simple
  // linked list reversal logic.
  reverse() {
    var prev, cur, succ;
    cur = prev = this.top;
    cur = cur.next;
    prev.next = null;

    while (cur != null) {
      succ = cur.next;
      cur.next = prev;
      prev = cur;
      cur = succ;
    }
    this.top = prev;
  }
}

// Driver code
var s = new Stack();
s.push(1);
s.push(2);
s.push(3);
s.push(4);
document.write("Original Stack <br>");
s.display();

// Reverse
s.reverse();

document.write("Reversed Stack <br>");
s.display();
