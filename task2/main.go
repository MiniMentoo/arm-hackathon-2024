package main

import (
	"bufio"
	"fmt"
	"os"

	queue "github.com/Jcowwell/go-algorithm-club/PriorityQueue"
)

type Node struct {
	Value      int
	IsExplored bool
}

type Item struct {
	Priority int
	Coord    Point
}

type Point struct {
	X int
	Y int
}

type Graph struct {
	MaxX int
	MaxY int
	Grid [][]Node
}

type Path struct {
	Sum int
}

func main() {
	// Initialize graph from file path
	graph := readGraph("office.txt")
	start := Point{
		X: 0,
		Y: 0,
	}
	end := Point{
		X: graph.MaxX - 1,
		Y: graph.MaxY - 1,
	}
	
	fmt.Println(bfs(start, end, graph))
}

// Graph Constructor
func graphConstructor(row []int) *Graph {
	maxX := len(row)
	nodeRow := make([]Node, 0)
	grid := make([][]Node, 0)

	for _, n := range row {
		newNode := Node{
			Value:      n,
			IsExplored: false,
		}
		nodeRow = append(nodeRow, newNode)
	}

	grid = append(grid, nodeRow)

	graph := Graph{
		MaxX: maxX,
		MaxY: 1,
		Grid: grid,
	}
	return &graph
}

func addRow(graph *Graph, row []int) {
	graph.MaxY += 1
	nodeRow := make([]Node, 0)
	for _, n := range row {
		newNode := Node{
			Value:      n,
			IsExplored: false,
		}
		nodeRow = append(nodeRow, newNode)
	}
	graph.Grid = append(graph.Grid, nodeRow)
}

func markCompleted(graph *Graph, point Point) {
	graph.Grid[point.Y][point.X].IsExplored = true
}

func isUnexplored(graph *Graph, point Point) bool {
	if point.Y >= graph.MaxY || point.Y < 0 || point.X >= graph.MaxX || point.X < 0 {
		return false
	} else {
		return !graph.Grid[point.Y][point.X].IsExplored
	}
}

func getValue(graph *Graph, point Point) int {
	return graph.Grid[point.Y][point.X].Value
}

func sort(item1, item2 Item) bool {
	return item1.Priority < item2.Priority
}

func findAdjacent(point Point) []Point {
	x := point.X
	y := point.Y
	list := []Point{
		{
			X: x + 1,
			Y: y,
		},
		{
			X: x,
			Y: y - 1,
		},
		{
			X: x - 1,
			Y: y,
		},
		{
			X: x,
			Y: y + 1,
		},
	}
	return list
}

// Breadth First Search Algorithm
func bfs(origin, end Point, graph *Graph) int {
	priorityQueue := queue.PriorityQueueInit(sort)
	markCompleted(graph, origin)
	priorityQueue.Enqueue(Item{Priority: getValue(graph, origin), Coord: origin})

	for !priorityQueue.IsEmpty() {
		item, _ := priorityQueue.Dequeue()

		// Return when reaching the final meeting room
		if item.Coord == end {
			return item.Priority
		}

		// Mark each point when explored and calculate the value of the path
		edges := findAdjacent(item.Coord)
		for _, v := range edges {
			if isUnexplored(graph, v) {
				markCompleted(graph, v)
				value := getValue(graph, v)
				priorityQueue.Enqueue(Item{Priority: (item.Priority + value), Coord: v})
			}
		}
	}
	return -1
}

func readGraph(filename string) *Graph {
	// open file
	file, err := os.Open(filename)
	if err != nil {
		fmt.Printf("error reading file: %v\n", err)
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	// Find length of a row
	scanner.Scan()
	row := scanner.Text()
	length := len(row)

	// initialize graph
	graph := graphConstructor(convertToRow(row, length))

	// Iterate over rows and add to graph
	for scanner.Scan() {
		addRow(graph, convertToRow(scanner.Text(), length))
	}
	return graph
}

// Convert string from file to row of ints
func convertToRow(line string, len int) []int {
	array := make([]int, len)
	for i, v := range line {
		array[i] = int(v - '0')
	}
	return array
}
