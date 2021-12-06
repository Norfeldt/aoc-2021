import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 4: Giant Squid ---', () => {
  const numbersDrawned = [
    7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24, 10, 16, 13, 6, 15, 25, 12, 22, 18, 20, 8, 19, 3, 26,
    1,
  ]

  const thirdBoard = [
    '14 21 17 24  4',
    '10 16 15  9 19',
    '18  8 23 26 20',
    '22 11 13  6  5',
    ' 2  0 12  3  7',
  ]

  function parseBoardToRows(board: string[]): number[][] {
    return board.reduce((acc, row) => {
      acc.push(row.trim().split(/\s+/).map(Number))
      return acc
    }, [] as number[][])
  }

  function convertRowsToColumns(rows: number[][]) {
    const columns = []
    for (let i = 0; i < rows[0].length; i++) {
      const column = []
      for (let j = 0; j < rows.length; j++) {
        column.push(rows[j][i])
      }
      columns.push(column)
    }
    return columns
  }

  it('converting board text to numbers matrix', () => {
    expect(parseBoardToRows(thirdBoard)).toEqual([
      [14, 21, 17, 24, 4],
      [10, 16, 15, 9, 19],
      [18, 8, 23, 26, 20],
      [22, 11, 13, 6, 5],
      [2, 0, 12, 3, 7],
    ])
  })

  it('converting rows to columns', () => {
    expect(convertRowsToColumns(parseBoardToRows(thirdBoard))).toEqual([
      [14, 10, 18, 22, 2],
      [21, 16, 8, 11, 0],
      [17, 15, 23, 13, 12],
      [24, 9, 26, 6, 3],
      [4, 19, 20, 5, 7],
    ])
  })

  const findDrawToWin = (
    board: number[][],
    draw: number[]
  ):
    | {
        drawnedNumbers: number[]
        boardAfterDraw: number[][]
      }
    | undefined => {
    const winDraw = []
    let boardRowsAndColumns = [...board, ...convertRowsToColumns(board)]

    for (const number of draw) {
      winDraw.push(number)

      boardRowsAndColumns = boardRowsAndColumns.reduce((acc, row) => {
        return [...acc, row.filter((n) => n !== number)]
      }, [] as number[][])

      if (boardRowsAndColumns.some((row) => row.length === 0)) {
        return {
          drawnedNumbers: winDraw,
          boardAfterDraw: boardRowsAndColumns.reduce((acc, row, index) => {
            if (index < board.length) {
              acc.push(row)
            }
            return acc
          }, [] as number[][]),
        }
      }
    }
  }

  it('finds draw for a board to win', () => {
    expect(findDrawToWin(parseBoardToRows(thirdBoard), numbersDrawned)?.drawnedNumbers).toEqual([
      7, 4, 9, 5, 11, 17, 23, 2, 0, 14, 21, 24,
    ])
    expect(findDrawToWin(parseBoardToRows(thirdBoard), numbersDrawned)?.boardAfterDraw).toEqual([
      [],
      [10, 16, 15, 19],
      [18, 8, 26, 20],
      [22, 13, 6],
      [12, 3],
    ])
  })

  describe('part 1: figure out which board will win first', () => {
    it('finds the score of the winning board', () => {
      const { drawnedNumbers, boardAfterDraw } = findDrawToWin(
        parseBoardToRows(thirdBoard),
        numbersDrawned
      )!

      let sumAllUnmarkedNumbers = boardAfterDraw.reduce((acc: number, row: number[]) => {
        return acc + row.reduce((acc, n) => acc + n, 0)
      }, 0)

      expect(sumAllUnmarkedNumbers).toEqual(188)
      expect(drawnedNumbers[drawnedNumbers.length - 1]).toEqual(24)

      const draw = [
        37, 60, 87, 13, 34, 72, 45, 49, 61, 27, 97, 88, 50, 30, 76, 40, 63, 9, 38, 67, 82, 6, 59,
        90, 99, 54, 11, 66, 98, 23, 64, 14, 18, 4, 10, 89, 46, 32, 19, 5, 1, 53, 25, 96, 2, 12, 86,
        58, 41, 68, 95, 8, 7, 3, 85, 70, 35, 55, 77, 44, 36, 51, 15, 52, 56, 57, 91, 16, 71, 92, 84,
        17, 33, 29, 47, 75, 80, 39, 83, 74, 73, 65, 78, 69, 21, 42, 31, 93, 22, 62, 24, 48, 81, 0,
        26, 43, 20, 28, 94, 79,
      ]

      const data = Deno.readTextFileSync('./04/data.txt').split('\n\n')
      const boards = data.map((board: string) => parseBoardToRows(board.split('\n')))

      expect(boards[0]).toEqual([
        [66, 78, 7, 45, 92],
        [39, 38, 62, 81, 77],
        [9, 73, 25, 97, 99],
        [87, 80, 19, 1, 71],
        [85, 35, 52, 26, 68],
      ])

      const winningBoard = boards.reduce((acc, board) => {
        const { drawnedNumbers, boardAfterDraw } = findDrawToWin(board, draw)!

        if ((drawnedNumbers.length ?? 100) < acc.drawnedNumbers.length) {
          return {
            drawnedNumbers,
            boardAfterDraw,
          }
        }

        return acc
      }, findDrawToWin(boards[0], draw)!)

      const lastNumber = winningBoard!.drawnedNumbers[winningBoard!.drawnedNumbers.length - 1]
      sumAllUnmarkedNumbers = winningBoard!.boardAfterDraw.reduce((acc: number, row: number[]) => {
        return acc + row.reduce((acc, n) => acc + n, 0)
      }, 0)

      console.log()
      console.log(winningBoard.drawnedNumbers)
      console.log(winningBoard.boardAfterDraw)

      logResult(sumAllUnmarkedNumbers * lastNumber)
    })

    describe('figure out which board will win last', () => {
      it('should be possible to revese the logic', () => {
        const draw = [
          37, 60, 87, 13, 34, 72, 45, 49, 61, 27, 97, 88, 50, 30, 76, 40, 63, 9, 38, 67, 82, 6, 59,
          90, 99, 54, 11, 66, 98, 23, 64, 14, 18, 4, 10, 89, 46, 32, 19, 5, 1, 53, 25, 96, 2, 12,
          86, 58, 41, 68, 95, 8, 7, 3, 85, 70, 35, 55, 77, 44, 36, 51, 15, 52, 56, 57, 91, 16, 71,
          92, 84, 17, 33, 29, 47, 75, 80, 39, 83, 74, 73, 65, 78, 69, 21, 42, 31, 93, 22, 62, 24,
          48, 81, 0, 26, 43, 20, 28, 94, 79,
        ]

        const data = Deno.readTextFileSync('./04/data.txt').split('\n\n')
        const boards = data.map((board: string) => parseBoardToRows(board.split('\n')))

        const loosingBoard = boards.reduce((acc, board) => {
          const { drawnedNumbers, boardAfterDraw } = findDrawToWin(board, draw)!

          if ((drawnedNumbers.length ?? 0) > acc.drawnedNumbers.length) {
            return {
              drawnedNumbers,
              boardAfterDraw,
            }
          }

          return acc
        }, findDrawToWin(boards[0], draw)!)

        const lastNumber = loosingBoard!.drawnedNumbers[loosingBoard!.drawnedNumbers.length - 1]
        const sumAllUnmarkedNumbers = loosingBoard!.boardAfterDraw.reduce(
          (acc: number, row: number[]) => {
            return acc + row.reduce((acc, n) => acc + n, 0)
          },
          0
        )

        console.log()
        console.log(loosingBoard.drawnedNumbers)
        console.log(loosingBoard.boardAfterDraw)

        logResult(sumAllUnmarkedNumbers * lastNumber)

        expect(true).toBeTruthy()
      })
    })
  })
})

run()
