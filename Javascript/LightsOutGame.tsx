"use client"

import React, { useState, useEffect } from "react"

const GRID_SIZE = 3

interface HistoryEntry {
  row: number
  col: number
  includedDiagonals: boolean
}

export default function LightsOutGame() {
  const [grid, setGrid] = useState<boolean[][]>([])
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [includeDiagonals, setIncludeDiagonals] = useState(false)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    resetGame()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && !isComplete) {
      interval = setInterval(() => setTime((time) => time + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, isComplete])

  const resetGame = () => {
    const newGrid = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill(false))
    setGrid(newGrid)
    setMoves(0)
    setTime(0)
    setIsRunning(true)
    setIsComplete(false)
    setHistory([])
    setCurrentStep(0)
  }

  const toggleLight = (row: number, col: number) => {
    if (isComplete) return

    const newGrid = grid.map((rowArray) => [...rowArray])
    const directions = [
      [0, 0], // Current light
      [0, 1], // Right
      [0, -1], // Left
      [1, 0], // Down
      [-1, 0], // Up
      ...(includeDiagonals
        ? [
            [1, 1],
            [1, -1],
            [-1, 1],
            [-1, -1],
          ]
        : []),
    ]

    directions.forEach(([dx, dy]) => {
      const newRow = row + dx
      const newCol = col + dy
      if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
        newGrid[newRow][newCol] = !newGrid[newRow][newCol]
      }
    })

    setGrid(newGrid)
    setMoves(moves + 1)
    setHistory([...history, { row, col, includedDiagonals: includeDiagonals }])
    setCurrentStep(currentStep + 1)

    if (newGrid.every((row) => row.every((cell) => !cell))) {
      setIsComplete(true)
      setIsRunning(false)
    }
  }

  const undoMove = () => {
    if (currentStep === 0) return

    const newHistory = [...history]
    const lastMove = newHistory.pop()
    if (lastMove) {
      toggleLight(lastMove.row, lastMove.col)
      setHistory(newHistory)
      setCurrentStep(currentStep - 1)
      setMoves(moves - 1)
    }
  }

  const getStepDescription = (step: number) => {
    const entry = history[step]
    if (!entry) return ""
    return `Step ${step + 1}: Click light at row ${entry.row + 1}, column ${entry.col + 1}${entry.includedDiagonals ? " (with diagonals)" : ""}`
  }

  return (
    <div>
      <h1>Lights Out Game</h1>
      <div>
        {grid.map((row, i) => (
          <div key={i} style={{ display: "flex" }}>
            {row.map((isOn, j) => (
              <button
                key={j}
                onClick={() => toggleLight(i, j)}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: isOn ? "yellow" : "gray",
                  margin: "2px",
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div>
        <p>Moves: {moves}</p>
        <p>
          Time: {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, "0")}
        </p>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={includeDiagonals} onChange={(e) => setIncludeDiagonals(e.target.checked)} />
          Include Diagonals
        </label>
      </div>
      {isComplete && <p>You won!</p>}
      <div>
        <button onClick={resetGame}>Reset Game</button>
        <button onClick={undoMove} disabled={currentStep === 0}>
          Undo
        </button>
      </div>
      <div>
        <h3>Game Progress:</h3>
        {history.map((_, index) => (
          <p key={index}>{getStepDescription(index)}</p>
        ))}
      </div>
    </div>
  )
}

