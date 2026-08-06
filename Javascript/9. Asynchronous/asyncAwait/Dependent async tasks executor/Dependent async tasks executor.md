Consider we have multiple async tasks A, B, C, D, and E ( not promises). A, B, and C are independent tasks while D depends on A and B to perform its task while E depends on D and C to perform its task. Write a task function/class in JavaScript to solve this problem.

To solve this problem. We create a class that will take the dependencies and a callback function as input.

In the dependencies list, we will check if all the tasks in the list is completed or not, if it is completed then filter them out as we no longer need to run them.

If there are no items in dependencies, invoke the callback directly.

Otherwise, if there are dependencies pending, push them into a list, and execute them one by one. Once all are completed invoke the callback.

Use a flag to determine the state of the task, i.e completed or not.

```javascript
class Task {
    // accept the dependencies list
    // and the callback
    constructor(dependencies = [], job) {
        // filter the dependencies that are not yet completed
        this.dependencies = dependencies ? dependencies.filter(dependency => dependency instanceof Task && !dependency.isCompleted) : [];
        this.currentDependencyCount = this.dependencies.length;
      
        // the callback
        this.job = job;
      
        // if current task is done
        this.isCompleted = false;
        
        // store the dependencies list callback
        // to execute is sequence
        this.subscribedList = [];
        
        // start the job
        this.processJob();
    }
    
    
    processJob() {
        // if there is dependency
        // subsribe to each of them
        if (this.dependencies && this.dependencies.length) {
            for (let dependency of this.dependencies) {
                dependency.subscribe(this.trackDependency.bind(this));
            }
        } 
        // else invoke the callback directly
        else {
            this.job(this.done.bind(this));
        }
    }
    
    // if all the dependecies are excuted
    // invoke the callback
    trackDependency() {
        this.currentDependencyCount--;
        if (this.currentDependencyCount === 0) {
            this.job(this.done.bind(this));
        }
    }
   
    // push the callback to the list
    subscribe(cb) {
        this.subscribedList.push(cb);
    }
  
    // if the current task is done
    // mark it as complete
    // invoke all the dependecy callbacks.
    // to print it in sequence
    done() {
        this.isCompleted = true;
        for (const callback of this.subscribedList) {
            callback();
        }
    }
}
```

```javascript
Input:
const processA = new Task(null, (done) => {
    setTimeout(() => {
        console.log('Process A');
        done();
    }, 100);
});

const processB = new Task([processA], (done) => {
    setTimeout(() => {
        console.log('Process B');
        done();
    }, 1500);
});

const processC = new Task(null, (done) => {
    setTimeout(() => {
        console.log('Process C');
        done();
    }, 1000);
});

const processD = new Task([processA, processB], (done) => {
    setTimeout(() => {
        console.log('Process D');
        done();
    }, 1000);
});

const processE = new Task([processC, processD], (done) => {
    setTimeout(() => {
        console.log('Process E');
        done();
    }, 100);
});

const createAllDoneInstance = (allDoneCallback) => new Task([processA, processB, processC, processD, processE], allDoneCallback);

createAllDoneInstance((done) => {
    console.log('All is done!');
    done();
});

Output:
"Process A"
"Process C"
"Process B"
"Process D"
"Process E"
"All is done!"
```