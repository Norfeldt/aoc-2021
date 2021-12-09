import { logResult } from './../helpers'
import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 5: Hydrothermal Venture ---', () => {
  const exampleData = [
    '0,9 -> 5,9',
    '8,0 -> 0,8',
    '9,4 -> 3,4',
    '2,2 -> 2,1',
    '7,0 -> 7,4',
    '6,4 -> 2,0',
    '0,9 -> 2,9',
    '3,4 -> 1,4',
    '0,0 -> 8,8',
    '5,5 -> 8,2',
  ]

  const exampleResult = [
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 1, 1, 2, 1, 1, 1, 2, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 2, 1, 1, 1, 0, 0, 0, 0],
  ]

  describe('part 1: the number of points where at least two lines overlap (vertical and horizontal only)', () => {
    function linesToCoordinates(coordinates: string): number[][] | null {
      const [[_entireMatch1, x1, y1], [_entireMatch2, x2, y2]] = [
        ...coordinates.matchAll(/(\d+),(\d+)/g),
      ]

      const spreadCoordinates = (xy1: string, xy2: string): number[] => {
        const [min, max] = [Number(xy1), Number(xy2)].sort((a, b) => a - b)
        const spread = new Array(max - min + 1).fill(min).map((value, index) => value + index)

        return spread
      }

      if (x1 === x2) {
        const yCoordinates = spreadCoordinates(y1, y2)

        return yCoordinates.map((y) => [Number(x1), y])
      }

      if (y1 === y2) {
        const xCoordinates = spreadCoordinates(x1, x2)

        return xCoordinates.map((x) => [x, Number(y1)])
      }

      return null
    }

    it('"1,1 -> 1,3" into [[1,1], [1,2], [1,3]]', () => {
      expect(linesToCoordinates('1,1 -> 1,3')).toEqual([
        [1, 1],
        [1, 2],
        [1, 3],
      ])
    })

    it('"9,7 -> 7,7" into [[9,7], [8,7], [7,7]] - order does not matter', () => {
      expect(linesToCoordinates('9,7 -> 7,7')).toEqual(
        [
          [9, 7],
          [8, 7],
          [7, 7],
        ].reverse()
      )
    })

    it('"5,5 -> 8,2" returns null', () => {
      expect(linesToCoordinates('5,5 -> 8,2')).toBeNull()
    })

    it('converts example data to example results', () => {
      const constructionData = (
        startEndLines: string[]
      ): {
        coordinates: number[][]
        maxX: number
        maxY: number
      } =>
        startEndLines.reduce(
          (acc, line) => {
            const coordinates = linesToCoordinates(line)
            if (coordinates == null) return acc

            acc.coordinates = [...acc.coordinates, ...coordinates]
            acc.maxX = Math.max(...coordinates.map(([x, y]) => x), acc.maxX)
            acc.maxY = Math.max(...coordinates.map(([x, y]) => y), acc.maxY)

            return acc
          },
          {
            coordinates: [] as number[][],
            maxX: 0,
            maxY: 0,
          }
        )

      const { coordinates, maxX, maxY } = constructionData(exampleData)

      // grid of 0 with maxY elements with maxX elements each (0,0 is top left)
      const grid = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0))
      for (const [x, y] of coordinates) {
        grid[y][x] += 1
      }
      expect(grid).toEqual(exampleResult)
      // count the items in the grid that is greater than 2
      expect(grid.flat().filter((item) => item >= 2).length).toBe(5)

      {
        const data = Deno.readTextFileSync('./05/data.txt').split('\n')
        const { coordinates, maxX, maxY } = constructionData(data)
        const grid = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0))
        for (const [x, y] of coordinates) {
          grid[y][x] += 1
        }

        console.log(grid.flat().filter((item) => item >= 2).length)
      }
    })
  })

  describe('part 2: the number of points where at least two lines overlap', () => {
    function linesToCoordinates(coordinates: string): number[][] | null {
      const [[_entireMatch1, x1, y1], [_entireMatch2, x2, y2]] = [
        ...coordinates.matchAll(/(\d+),(\d+)/g),
      ]

      const spreadCoordinates = (xy1: string, xy2: string): number[] => {
        const [min, max] = [Number(xy1), Number(xy2)].sort((a, b) => a - b)
        const spread = new Array(max - min + 1).fill(min).map((value, index) => value + index)

        if (min == xy1) return spread

        return spread.reverse()
      }

      if (x1 === x2) {
        const yCoordinates = spreadCoordinates(y1, y2)

        return yCoordinates.map((y) => [Number(x1), y])
      }

      if (y1 === y2) {
        const xCoordinates = spreadCoordinates(x1, x2)

        return xCoordinates.map((x) => [x, Number(y1)])
      }

      const [xCoordinates, yCoordinates] = [spreadCoordinates(x1, x2), spreadCoordinates(y1, y2)]

      return xCoordinates.map((x, index) => [x, yCoordinates[index]])
    }

    it('"1,1 -> 1,3" into [[1,1], [1,2], [1,3]]', () => {
      expect(linesToCoordinates('1,1 -> 1,3')).toEqual([
        [1, 1],
        [1, 2],
        [1, 3],
      ])
    })

    it('"9,7 -> 7,7" into [[9,7], [8,7], [7,7]]', () => {
      expect(linesToCoordinates('9,7 -> 7,7')).toEqual([
        [9, 7],
        [8, 7],
        [7, 7],
      ])
    })

    it('"9,7 -> 7,9" returns [[9,7], [8,8], [7,9]]', () => {
      expect(linesToCoordinates('9,7 -> 7,9')).toEqual([
        [9, 7],
        [8, 8],
        [7, 9],
      ])
    })

    it('converts example data to example results', () => {
      const constructionData = (
        startEndLines: string[]
      ): {
        coordinates: number[][]
        maxX: number
        maxY: number
      } =>
        startEndLines.reduce(
          (acc, line) => {
            const coordinates = linesToCoordinates(line)
            if (coordinates == null) return acc

            acc.coordinates = [...acc.coordinates, ...coordinates]
            acc.maxX = Math.max(...coordinates.map(([x, y]) => x), acc.maxX)
            acc.maxY = Math.max(...coordinates.map(([x, y]) => y), acc.maxY)

            return acc
          },
          {
            coordinates: [] as number[][],
            maxX: 0,
            maxY: 0,
          }
        )

      const { coordinates, maxX, maxY } = constructionData(exampleData)

      // grid of 0 with maxY elements with maxX elements each (0,0 is top left)
      const grid = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0))
      for (const [x, y] of coordinates) {
        grid[y][x] += 1
      }
      // count the items in the grid that is greater than 2
      expect(grid.flat().filter((item) => item >= 2).length).toBe(12)

      {
        const data = Deno.readTextFileSync('./05/data.txt').split('\n')
        const { coordinates, maxX, maxY } = constructionData(data)
        const grid = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0))
        for (const [x, y] of coordinates) {
          grid[y][x] += 1
        }

        console.log(grid.flat().filter((item) => item >= 2).length)
      }
    })
  })
})

run()
