type JobFunction = (done: () => void) => void | Promise<void>;

export class Task {
  private dependencies: Task[];
  private job: JobFunction;
  public isCompleted: boolean;
  private subscribedList: (() => void)[];

  constructor(dependencies: Task[] | null = null, job: JobFunction) {
    this.dependencies = dependencies?.filter(dep => dep instanceof Task && !dep.isCompleted) || [];
    this.job = job;
    this.isCompleted = false;
    this.subscribedList = [];
    this.processJob();
  }

  private async processJob() {
    if (this.dependencies.length) {
      await Promise.all(this.dependencies.map(dep => new Promise(resolve => dep.subscribe(resolve))));
    }
    await new Promise<void>(resolve => this.job(() => resolve()));
    this.done();
  }

  public subscribe(cb: () => void) {
    this.subscribedList.push(cb);
  }

  private done() {
    this.isCompleted = true;
    for (const callback of this.subscribedList) {
      callback();
    }
  }
}

