import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 9: Smoke Basin ---', () => {
  const exampleData = ['2199943210', '3987894921', '9856789892', '8767896789', '9899965678']
  const data = Deno.readTextFileSync('09/data.txt').split('\n')

  function getMatrix(data: string[]): number[][] {
    return data.map((line) => line.split('').map(Number))
  }

  // function revser matrix of rows into columns
  function transpose(matrix: number[][]): number[][] {
    const transposed: number[][] = []
    for (let i = 0; i < matrix[0].length; i++) {
      transposed.push([])
    }
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        transposed[j].push(matrix[i][j])
      }
    }
    return transposed
  }

  describe('data massage', () => {
    it('parse data into a matrix', () => {})

    it('should transpose the matrix', () => {
      const transposed = transpose([
        [1, 2, 3],
        [4, 5, 6],
      ])
      expect(transposed).toEqual([
        [1, 4],
        [2, 5],
        [3, 6],
      ])
    })
  })

  describe('sum of the risk levels of all low points on a heightmap', () => {
    function findIndicesForLowestPointHorizontally(row: number[]): number[] {
      const indices = row.reduce((acc, value, index, row) => {
        if (value < (row[index - 1] ?? 100) && value < (row[index + 1] ?? 100)) {
          acc.push(index)
        }
        return acc
      }, [] as number[])

      return indices
    }

    function lowestPointsCoordinates(input: number[][]): [number, number][] {
      const lowestRowPoints: [number, number][] = []
      for (const [columnIndex, row] of input.entries()) {
        findIndicesForLowestPointHorizontally(row).forEach((index) => {
          lowestRowPoints.push([columnIndex, index])
        })
      }

      const lowestColumnPoints: [number, number][] = []
      for (const [rowIndex, column] of transpose(input).entries()) {
        findIndicesForLowestPointHorizontally(column).forEach((index) => {
          lowestColumnPoints.push([index, rowIndex])
        })
      }

      // console.log(lowestRowPoints)
      // console.log(lowestColumnPoints.sort((a, b) => a[0] - b[0]))

      // return array of common elements between the two arrays of arrays of points
      const lowestPoints = lowestRowPoints.filter((rowPoints) =>
        lowestColumnPoints.some(
          (columnPoints) => rowPoints[0] === columnPoints[0] && rowPoints[1] === columnPoints[1]
        )
      )
      // console.log(lowestPoints)

      return lowestPoints
    }

    function riskLevel(matrix: number[][]): number {
      const lowestPoints = lowestPointsCoordinates(matrix)
      const sum = lowestPoints.reduce((acc, [x, y]) => acc + matrix[x][y] + 1, 0)
      return sum
    }

    const exampleDataMatrix = getMatrix(exampleData)
    const exampleDataTransposed = transpose(exampleDataMatrix)

    it('findes lowest points horizontally', () => {
      expect(findIndicesForLowestPointHorizontally(exampleDataMatrix[0])).toEqual([1, 9])
      expect(findIndicesForLowestPointHorizontally(exampleDataMatrix[1])).toEqual([0, 3, 6, 9])
    })

    it('finds the lowest points', () => {
      expect(lowestPointsCoordinates(exampleDataMatrix).length).toEqual(4)
      expect(riskLevel(exampleDataMatrix)).toEqual(15)

      logResult(riskLevel(getMatrix(data)))
    })
  })

  describe('part 2: find the largest basins so you know what areas are most important to avoid', () => {
    function basinMutateCounter(
      matrix: number[][],
      columnIndex: number,
      rowIndex: number
    ): { matrix: number[][]; count: number } {
      let matrixClone = JSON.parse(JSON.stringify(matrix))
      let count = 0
      if (matrixClone[columnIndex][rowIndex] < 9) {
        count++
        matrixClone[columnIndex][rowIndex] = 9

        // check right

        if (rowIndex + 1 < matrixClone[columnIndex].length) {
          const { count: countRight, matrix: matrixRight } = basinMutateCounter(
            matrixClone,
            columnIndex,
            rowIndex + 1
          )
          count += countRight
          matrixClone = matrixRight
        }

        // check down
        if (columnIndex + 1 < matrixClone.length) {
          const { count: countDown, matrix: matrixDown } = basinMutateCounter(
            matrixClone,
            columnIndex + 1,
            rowIndex
          )
          count += countDown
          matrixClone = matrixDown
        }

        // check left
        if (rowIndex - 1 >= 0) {
          const { count: countLeft, matrix: matrixLeft } = basinMutateCounter(
            matrixClone,
            columnIndex,
            rowIndex - 1
          )
          count += countLeft
          matrixClone = matrixLeft
        }

        // check up
        if (columnIndex - 1 >= 0) {
          const { count: countUp, matrix: matrixUp } = basinMutateCounter(
            matrixClone,
            columnIndex - 1,
            rowIndex
          )
          count += countUp
          matrixClone = matrixUp
        }
      }

      return {
        matrix: matrixClone,
        count,
      }
    }

    it('change the point number when done with it', () => {
      expect(basinMutateCounter([[1, 9, 9]], 0, 0)).toEqual({ matrix: [[9, 9, 9]], count: 1 })
      expect(basinMutateCounter([[1, 8, 9]], 0, 0)).toEqual({ matrix: [[9, 9, 9]], count: 2 })
      expect(
        basinMutateCounter(
          [
            [1, 8, 9],
            [4, 9, 9],
          ],
          0,
          0
        )
      ).toEqual({
        matrix: [
          [9, 9, 9],
          [9, 9, 9],
        ],
        count: 3,
      })

      const expectedMatrix = getMatrix(exampleData)
      expectedMatrix[0][0] = 9
      expectedMatrix[0][1] = 9
      expectedMatrix[1][0] = 9
      expect(basinMutateCounter(getMatrix(exampleData), 0, 0)).toEqual({
        matrix: expectedMatrix,
        count: 3,
      })

      expect(basinMutateCounter(getMatrix(exampleData), 0, 5).count).toEqual(9)

      function threeLargestBasinsAreas(matrix: number[][]): [number, number, number] {
        let largestBasins: [number, number, number] = [0, 0, 0]
        for (const [columnIndex, row] of matrix.entries()) {
          for (const [rowIndex, _value] of row.entries()) {
            const { matrix: matrixClone, count } = basinMutateCounter(matrix, columnIndex, rowIndex)
            matrix = matrixClone
            largestBasins = [...largestBasins, count].sort((a, b) => b - a).slice(0, 3) as [
              number,
              number,
              number
            ]
          }
        }
        return largestBasins
      }

      let matrix = getMatrix(exampleData)
      expect(threeLargestBasinsAreas(matrix)).toEqual([14, 9, 9])

      logResult(threeLargestBasinsAreas(getMatrix(data)).reduce((acc, curr) => acc * curr, 1))
    })
  })
})

run()
