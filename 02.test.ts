import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from './helpers.ts'

describe('2nd of december - DIVE POSITION', () => {
  const exampleData = ['forward 5', 'down 5', 'forward 8', 'up 3', 'down 8', 'forward 2']

  describe('part 1', () => {
    function calculateDivePosition(data: string[]): { horizontal: number; dept: number } {
      let horizontal = 0
      let dept = 0
      for (const command of data) {
        const [direction, value] = command.split(' ')
        if (direction === 'forward') {
          horizontal += Number(value)
        } else if (direction === 'up') {
          dept -= Number(value)
        } else if (direction === 'down') {
          dept += Number(value)
        }
      }
      return { horizontal, dept }
    }

    it('example for part 1', () => {
      expect(calculateDivePosition(exampleData)).toEqual({ horizontal: 15, dept: 10 })
    })

    it('part 1 challenge', () => {
      const data = Deno.readTextFileSync('./02.data.part1.txt').split('\n')

      const result = calculateDivePosition(data)

      logResult(JSON.stringify(result))
      logResult(result.horizontal * result.dept)
      expect(true).toBe(true)
    })
  })

  describe('part 2', () => {
    function calculateDivePosition(data: string[]): { horizontal: number; dept: number } {
      let horizontal = 0
      let dept = 0
      let aim = 0
      for (const command of data) {
        const [direction, value] = command.split(' ')
        if (direction === 'forward') {
          horizontal += Number(value)
          dept += Number(value) * aim
        } else if (direction === 'up') {
          aim -= Number(value)
        } else if (direction === 'down') {
          aim += Number(value)
        }

        // log(command)
        // log(JSON.stringify({ horizontal, dept, aim }))
      }

      return { horizontal, dept }
    }

    it('example for part 2', () => {
      expect(calculateDivePosition(exampleData)).toEqual({ horizontal: 15, dept: 60 })
    })

    it('part 2 challenge', () => {
      const data = Deno.readTextFileSync('./02.data.part1.txt').split('\n')

      const result = calculateDivePosition(data)

      logResult(JSON.stringify(result))
      logResult(result.horizontal * result.dept)
      expect(true).toBe(true)
    })
  })
})

run()
