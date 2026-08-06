'use client'

import React, { useState, useEffect } from 'react';
import { Task } from '../utils/Task';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface TaskNode {
  name: string;
  task: Task;
  dependencies: string[];
  status: 'pending' | 'running' | 'completed';
}

export default function TaskVisualizer() {
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);

  const createTask = (name: string, dependencies: TaskNode[], delay: number): TaskNode => {
    const task = new Task(
      dependencies.map(d => d.task),
      (done) => new Promise<void>(resolve => {
        setTasks(prev => prev.map(t => t.name === name ? { ...t, status: 'running' } : t));
        setTimeout(() => {
          setExecutionOrder(prev => [...prev, name]);
          setTasks(prev => prev.map(t => t.name === name ? { ...t, status: 'completed' } : t));
          done();
          resolve();
        }, delay);
      })
    );

    return {
      name,
      task,
      dependencies: dependencies.map(d => d.name),
      status: 'pending'
    };
  };

  const initializeTasks = () => {
    const taskA = createTask('A', [], 100);
    const taskC = createTask('C', [], 1000);
    const taskB = createTask('B', [taskA], 1500);
    const taskD = createTask('D', [taskA, taskB], 1000);
    const taskE = createTask('E', [taskC, taskD], 100);

    setTasks([taskA, taskB, taskC, taskD, taskE]);
    setExecutionOrder([]);

    new Task([taskA.task, taskB.task, taskC.task, taskD.task, taskE.task], (done) => {
      setExecutionOrder(prev => [...prev, 'All Done']);
      done();
    });
  };

  useEffect(() => {
    initializeTasks();
  }, []);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Task Execution Visualizer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {tasks.map(task => (
            <div key={task.name} className="border p-2 rounded">
              <h3 className="font-bold">Task {task.name}</h3>
              <p>Status: {task.status}</p>
              <p>Dependencies: {task.dependencies.join(', ') || 'None'}</p>
            </div>
          ))}
        </div>
        <div className="mb-4">
          <h3 className="font-bold">Execution Order:</h3>
          <p>{executionOrder.join(' -> ')}</p>
        </div>
        <Button onClick={initializeTasks}>Restart Execution</Button>
      </CardContent>
    </Card>
  );
}

