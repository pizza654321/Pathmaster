import React, { Component } from 'react';
import Node from './Node/Node'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import {runAlgorithm, getNodesInOrder} from '../Algorithms/RunAlgorithm.js';

import './Pathmaster.css'

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      pieceType: "Knight"
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  setPieceType(piece) {
    console.log(piece)
    this.setState({ pieceType: piece })
  }

  handleMouseDown(row, col) {
    if (row === undefined && col === undefined) {
      this.setState({ mouseIsPressed: true });
    } else {
      const newGrid = getNewGrid(this.state.grid, row, col);
      this.setState({ grid: newGrid, mouseIsPressed: true });
    }

  }

  handleMouseEnter(row, col) {
    if (this.state.mouseIsPressed) {
      const newGrid = getNewGrid(this.state.grid, row, col);
      this.setState({ grid: newGrid });
    }
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualize(algo) {
    const { grid, pieceType } = this.state;
    console.log(pieceType)
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = runAlgorithm(algo, grid, startNode, finishNode, pieceType);
    const nodesInShortestPathOrder = getNodesInOrder(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    var { grid, pieceType } = this.state;

    return (
      <>
        <Header />
        <div className="grid"
          onMouseUp={() => this.handleMouseUp()}
          onMouseDown={() => this.handleMouseDown()}>
          {grid.map((row, rowIdx) => {
            return (
              <div className="row" key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { col, row, isFinish, isStart, isColor, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      row={row}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isColor={isColor}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) => this.handleMouseEnter(row, col)}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
        <button onClick={(e) => this.setPieceType(e.target.innerHTML)}>
          Bishop
              </button>
        <button onClick={(e) => this.setPieceType(e.target.innerHTML)}>
          Rook
              </button>
        <button onClick={(e) => this.setPieceType(e.target.innerHTML)}>
          Knight
              </button>
        <button onClick={(e) => this.setPieceType(e.target.innerHTML)}>
          King
              </button>
        <button onClick={(e) => this.setPieceType(e.target.innerHTML)}>
          Queen
              </button>
        <button onClick={() => this.visualize("Dijkstra")}>
          Visualize Dijkstra's Algorithm
              </button>
        <button onClick={() => this.visualize("BFS")}>
          Visualize BFS Algorithm
              </button>
        <button onClick={() => this.visualize("Astar")}>
          Visualize A* Algorithm
              </button>
        <p>
          Current selected piece: {pieceType}
        </p>
        <Footer />
      </>
    );
  }
}

const NUM_ROWS = 30;
const NUM_COLS = 70;
const START_NODE_ROW = Math.floor(NUM_ROWS / 2);
const START_NODE_COL = Math.floor(NUM_COLS / 4);
const FINISH_NODE_ROW = Math.floor(NUM_ROWS / 2);
const FINISH_NODE_COL = Math.floor(NUM_COLS * 3 / 4);

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < NUM_ROWS; row++) {
    const currentRow = [];
    for (let col = 0; col < NUM_COLS; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};
const createNode = (col, row) => {
  return {
    col,
    row,
    distance: Infinity,
    heuristic: Math.sqrt(Math.pow(col-FINISH_NODE_COL,2) + Math.pow(row-FINISH_NODE_ROW,2)),
    isVisited: false,
    isChanged: false,
    previousNode: null,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    isColor: row % 2 === col % 2,
    isWall: false,
  };
};
const getNewGrid = (grid, row, col) => {
  const node = grid[row][col];
  if (!node.isStart && !node.isFinish) {
    node.isWall = !node.isWall;
  }
  return grid;
};