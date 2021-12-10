import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 6: Lanternfish ---', () => {
  const exampleData = []

  describe('part 1: How many lanternfish would there be after 80 days?', () => {
    const exampleData = [3, 4, 3, 1, 2]

    function simulateBreeding(lanternfish: number[], days: number): number {
      let fishes = [...lanternfish]
      for (const day of Array(days).keys()) {
        const { fishesAfterOneDay, newFishes } = fishes
          .map((timer) => timer - 1)
          .reduce(
            (acc, timer) => {
              if (timer > -1) acc.fishesAfterOneDay.push(timer)
              if (timer === -1) {
                acc.fishesAfterOneDay.push(6)
                acc.newFishes += 1
              }

              return acc
            },
            { fishesAfterOneDay: [], newFishes: 0 } as {
              fishesAfterOneDay: number[]
              newFishes: number
            }
          )

        fishes = [...fishesAfterOneDay, ...Array(newFishes).fill(8)]
      }

      return fishes.length
    }
    it('takes 18 days for 3,4,3,1,2 fish to become 26', () => {
      expect(simulateBreeding(exampleData, 18)).toEqual(26)

      // read data as array of numbers
      const data = Deno.readTextFileSync('./06/data.txt').split(',').map(Number)
      console.log(simulateBreeding(data, 80))
    })
  })

  describe('part 2: How many lanternfish would there be after 256 days?', () => {
    it('takes 256 days to get a total of 26984457539 lanternfish', () => {
      // function that makes [3, 4, 3, 1, 2] into [0, 1, 1, 2, 1, 0, 0, 0]
      function fishAccumulator(lanternfish: number[]): number[] {
        const counts = new Array(8 + 1)
          .fill(0)
          .map((_, i) => lanternfish.filter((fish) => fish === i).length)

        return counts
      }

      function simulateBreeding(fishAccumulator: number[], days: number): number {
        let fishes = [...fishAccumulator]
        for (const day of Array(days).keys()) {
          const multiply = fishes[0]
          fishes.shift()
          if (multiply > 0) {
            fishes.push(multiply)
            fishes[6] += multiply
          } else {
            fishes.push(0)
          }
        }

        return fishes.reduce((acc, fishCount) => acc + fishCount, 0)
      }

      expect(fishAccumulator([3, 4, 3, 1, 2])).toEqual([0, 1, 1, 2, 1, 0, 0, 0, 0])
      expect(simulateBreeding(fishAccumulator([3, 4, 3, 1, 2]), 256)).toEqual(26984457539)

      const data = Deno.readTextFileSync('./06/data.txt').split(',').map(Number)
      log(simulateBreeding(fishAccumulator(data), 256))
    })
  })
})

run()
