import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 11: Dumbo Octopus ---', () => {
  const exampleData = [
    [5, 4, 8, 3, 1, 4, 3, 2, 2, 3],
    [2, 7, 4, 5, 8, 5, 4, 7, 1, 1],
    [5, 2, 6, 4, 5, 5, 6, 1, 7, 3],
    [6, 1, 4, 1, 3, 3, 6, 1, 4, 6],
    [6, 3, 5, 7, 3, 8, 5, 4, 7, 8],
    [4, 1, 6, 7, 5, 2, 4, 6, 4, 5],
    [2, 1, 7, 6, 8, 4, 1, 7, 2, 1],
    [6, 8, 8, 2, 8, 8, 1, 1, 3, 4],
    [4, 8, 4, 6, 8, 4, 8, 5, 5, 4],
    [5, 2, 8, 3, 7, 5, 1, 5, 2, 6],
  ]
  const data = Deno.readTextFileSync('11/data.txt')
    .split('\n')
    .map((row) => row.split('').map(Number))

  // increment all values in a 2d array
  function incrementMatrix(matrix: number[][]): number[][] {
    const matrixClone = JSON.parse(JSON.stringify(matrix))
    for (let i = 0; i < matrixClone.length; i++) {
      for (let j = 0; j < matrixClone[i].length; j++) {
        matrixClone[i][j]++
      }
    }

    return matrixClone
  }

  function flashEffect(row: number, column: number, center: [number, number]): number[][] {
    const [centerRow, centerColumn] = center
    const matrixEffect = new Array(row).fill(0).map(() => new Array(column).fill(0))
    for (const rowAdjacent of [-1, 0, 1]) {
      for (const columnAdjacent of [-1, 0, 1]) {
        if (rowAdjacent === 0 && columnAdjacent === 0) continue

        const [rowIndex, columnIndex] = [centerRow + rowAdjacent, centerColumn + columnAdjacent]
        if (matrixEffect?.[rowIndex]?.[columnIndex] != undefined) {
          matrixEffect[rowIndex][columnIndex] = 1
        }
      }
    }

    return matrixEffect
  }

  // function to add to 2d arrays together
  function add(matrix1: number[][], matrix2: number[][]): number[][] {
    const matrixClone = JSON.parse(JSON.stringify(matrix1))
    for (let i = 0; i < matrixClone.length; i++) {
      for (let j = 0; j < matrixClone[i].length; j++) {
        matrixClone[i][j] += matrix2[i][j]
      }
    }
    return matrixClone
  }

  function trackFlashesRecord(matrix: number[][]): string[] {
    const trackingRecordClone: string[] = []
    for (const [rowIndex, row] of matrix.entries()) {
      for (const [columnIndex, value] of row.entries()) {
        if (value > 9) {
          const position = `${rowIndex},${columnIndex}`
          if (!trackingRecordClone.includes(position)) {
            trackingRecordClone.push(position)
          }
        }
      }
    }

    return trackingRecordClone.sort((a: string, b: string) => a.localeCompare(b))
  }

  function resetEnergizedCells(matrix: number[][]): number[][] {
    const matrixClone = JSON.parse(JSON.stringify(matrix))
    for (const row of matrixClone) {
      for (const value of row) {
        if (value > 9) {
          row[row.indexOf(value)] = 0
        }
      }
    }
    return matrixClone
  }

  describe('total flashes after 100 steps', () => {
    // First, the energy level of each octopus increases by 1.
    it('able to increment all matrix elements in a step', () => {
      expect(
        incrementMatrix([
          [1, 2, 3],
          [4, 5, 6],
        ])
      ).toEqual([
        [2, 3, 4],
        [5, 6, 7],
      ])
    })

    // Then, any octopus with an energy level greater than 9 flashes. This increases the energy level of all adjacent octopuses by 1, including octopuses that are diagonally adjacent. If this causes an octopus to have an energy level greater than 9, it also flashes.
    it('makes the flash effect matrix at any position', () => {
      expect(flashEffect(3, 3, [1, 1])).toEqual([
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ])

      expect(flashEffect(3, 3, [0, 0])).toEqual([
        [0, 1, 0],
        [1, 1, 0],
        [0, 0, 0],
      ])

      expect(flashEffect(3, 3, [0, 2])).toEqual([
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
      ])

      expect(flashEffect(3, 3, [2, 2])).toEqual([
        [0, 0, 0],
        [0, 1, 1],
        [0, 1, 0],
      ])
    })

    it('adds to matrix together', () => {
      expect(
        add(
          [
            [1, 2, 3],
            [4, 5, 6],
          ],
          [
            [1, 2, 3],
            [4, 5, 6],
          ]
        )
      ).toEqual([
        [2, 4, 6],
        [8, 10, 12],
      ])
    })

    // This process continues as long as new octopuses keep having their energy level increased beyond 9.(An octopus can only flash at most once per step.)
    it('keeps track of which octopus has flashed', () => {
      const matrix = [
        [0, 0, 0],
        [0, 9, 10],
      ]
      expect(trackFlashesRecord(matrix)).toEqual(['1,2'])
      expect(trackFlashesRecord(matrix)).toEqual(['1,2'])

      expect(trackFlashesRecord(incrementMatrix(matrix))).toEqual(['1,1', '1,2'])
    })

    // Finally, any octopus that flashed during this step has its energy level set to 0, as it used all of its energy to flash.
    it('sets the energy level of an octopus to 0', () => {
      expect(
        resetEnergizedCells([
          [10, 12, 4],
          [11, 10, 5],
        ])
      ).toEqual([
        [0, 0, 4],
        [0, 0, 5],
      ])
    })

    function simulateOctapus(
      matrix: number[][],
      steps: number
    ): { count: number; matrix: number[][] } {
      let matrixClone = JSON.parse(JSON.stringify(matrix))
      let count = 0
      // console.log()
      // console.log(`Step 0`)
      // console.log(matrixClone)

      for (const step of new Array(steps).keys()) {
        // console.log(`Step ${step + 1}`)

        matrixClone = incrementMatrix(matrixClone)
        // console.table(matrixClone)

        let todos = trackFlashesRecord(matrixClone)
        let dones: string[] = []
        while (todos.length > 0) {
          // console.log({ todos })
          dones = [...dones, ...todos]
          todos.forEach((position) => {
            // console.log(`${position} flashes`)
            matrixClone = add(
              matrixClone,
              flashEffect(
                matrixClone.length,
                matrixClone[0].length,
                position.split(',').map(Number) as [number, number]
              )
            )
            // console.table(matrixClone)
          })

          // console.table(matrixClone)

          todos = [
            ...trackFlashesRecord(matrixClone).filter((position) => !dones.includes(position)),
          ]
        }

        count += matrixClone.reduce(
          (acc: number, row: number[]) =>
            acc +
            row.reduce((acc: number, cell: number) => {
              return cell > 9 ? acc + 1 : acc
            }, 0),
          0
        )

        matrixClone = resetEnergizedCells(matrixClone)

        // check if 2d array items are all equal to zero
        if (matrixClone.every((row: number[]) => row.every((cell: number) => cell === 0))) {
          logResult(`step ${step + 1}`)
        }

        // console.log(matrixClone)
      }

      return {
        count,
        matrix: matrixClone,
      }
    }

    it('combines the methods to produce the small example result', () => {
      const matrixStep0 = [
        [1, 1, 1, 1, 1],
        [1, 9, 9, 9, 1],
        [1, 9, 1, 9, 1],
        [1, 9, 9, 9, 1],
        [1, 1, 1, 1, 1],
      ]
      const matrixStep1 = [
        [3, 4, 5, 4, 3],
        [4, 0, 0, 0, 4],
        [5, 0, 0, 0, 5],
        [4, 0, 0, 0, 4],
        [3, 4, 5, 4, 3],
      ]
      const matrixStep2 = [
        [4, 5, 6, 5, 4],
        [5, 1, 1, 1, 5],
        [6, 1, 1, 1, 6],
        [5, 1, 1, 1, 5],
        [4, 5, 6, 5, 4],
      ]

      expect(simulateOctapus(matrixStep0, 1)).toEqual({ count: 9, matrix: matrixStep1 })
      expect(simulateOctapus(matrixStep0, 2)).toEqual({ count: 9, matrix: matrixStep2 })
    })

    it('counts the number of flashes in the larger example', () => {
      const matrixStep2 = [
        [8, 8, 0, 7, 4, 7, 6, 5, 5, 5],
        [5, 0, 8, 9, 0, 8, 7, 0, 5, 4],
        [8, 5, 9, 7, 8, 8, 9, 6, 0, 8],
        [8, 4, 8, 5, 7, 6, 9, 6, 0, 0],
        [8, 7, 0, 0, 9, 0, 8, 8, 0, 0],
        [6, 6, 0, 0, 0, 8, 8, 9, 8, 9],
        [6, 8, 0, 0, 0, 0, 5, 9, 4, 3],
        [0, 0, 0, 0, 0, 0, 7, 4, 5, 6],
        [9, 0, 0, 0, 0, 0, 0, 8, 7, 6],
        [8, 7, 0, 0, 0, 0, 6, 8, 4, 8],
      ]

      expect(simulateOctapus(exampleData, 2).matrix).toEqual(matrixStep2)
      expect(simulateOctapus(exampleData, 100).count).toEqual(1656)
    })

    describe('finding out what step all flashes', () => {
      it('just try a high number and pick the first step from the logged result', () => {
        simulateOctapus(data, 500)
      })
    })
  })
})

run()
