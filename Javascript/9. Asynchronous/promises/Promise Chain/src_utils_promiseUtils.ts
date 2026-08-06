export interface ChainStep {
  id: number;
  description: string;
  value: any;
  type: 'then' | 'catch' | 'finally';
}

export function executePromiseChain(): Promise<ChainStep[]> {
  const steps: ChainStep[] = [];
  let stepId = 0;

  return Promise.resolve(1)
    .then(val => {
      steps.push({
        id: ++stepId,
        description: 'First then - returns val + 1',
        value: val,
        type: 'then'
      });
      return val + 1;
    })
    .then(val => {
      steps.push({
        id: ++stepId,
        description: 'Second then - no return value',
        value: val,
        type: 'then'
      });
    })
    .then(val => {
      steps.push({
        id: ++stepId,
        description: 'Third then - nested promise',
        value: val,
        type: 'then'
      });
      return Promise.resolve(3).then(nestedVal => {
        steps.push({
          id: ++stepId,
          description: 'Nested promise resolution',
          value: nestedVal,
          type: 'then'
        });
      });
    })
    .then(val => {
      steps.push({
        id: ++stepId,
        description: 'Fourth then - reject with 4',
        value: val,
        type: 'then'
      });
      return Promise.reject(4);
    })
    .catch(val => {
      steps.push({
        id: ++stepId,
        description: 'Catch block',
        value: val,
        type: 'catch'
      });
    })
    .finally(() => {
      steps.push({
        id: ++stepId,
        description: 'Finally block - return value ignored',
        value: undefined,
        type: 'finally'
      });
      return 10;
    })
    .then(() => steps);
}

