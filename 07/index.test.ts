import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 7: The Treachery of Whales ---', () => {
  const exampleData = [16, 1, 2, 0, 4, 2, 7, 1, 2, 14]
  const data = Deno.readTextFileSync('./07/data.txt').split(',').map(Number)

  describe('part 1: sub-marine fleet of crabs', () => {
    function fuelCost(crabs: number[], position: number): number {
      return crabs.reduce((acc, cur) => {
        const cost = Math.abs(cur - position)
        return acc + cost
      }, 0)
    }

    function findingLowestFuelCost(crabs: number[]): number {
      let lowestCost = Number.MAX_SAFE_INTEGER
      let lowestCostPosition = 0
      for (let i = 1; i < Math.max(...crabs) + 1; i++) {
        const cost = fuelCost(crabs, i)
        if (cost < lowestCost) {
          lowestCost = cost
          lowestCostPosition = i
        }
      }
      return lowestCostPosition
    }

    it('costs a total of 37 fuel to move to postion 2', () => {
      expect(fuelCost(exampleData, 2)).toEqual(37)
    })

    it('costs a total of 41 fuel to move to postion 1', () => {
      expect(fuelCost(exampleData, 1)).toEqual(41)
    })

    it('costs a total of 71 fuel to move to postion 10', () => {
      expect(fuelCost(exampleData, 10)).toEqual(71)
    })

    it('finds the lowest fuel cost position to be 2', () => {
      expect(findingLowestFuelCost(exampleData)).toEqual(2)

      logResult(fuelCost(data, findingLowestFuelCost(data)))
    })
  })

  describe('part 2: crab engineering fuel', () => {
    function crabFuelCostFromPositions(from: number, to: number): number {
      let cost = 0
      const diff = Math.abs(from - to)
      if (diff === 0) return cost

      for (let i = 1; i < diff + 1; i++) {
        cost += i
      }

      return cost
    }

    function fuelCost(crabs: number[], position: number): number {
      return crabs.reduce((acc, cur) => {
        const cost = crabFuelCostFromPositions(cur, position)
        return acc + cost
      }, 0)
    }

    function findingLowestFuelCost(crabs: number[]): number {
      let lowestCost = Number.MAX_SAFE_INTEGER
      let lowestCostPosition = 0
      for (let i = 1; i < Math.max(...crabs) + 1; i++) {
        const cost = fuelCost(crabs, i)
        if (cost < lowestCost) {
          lowestCost = cost
          lowestCostPosition = i
        }
      }
      return lowestCostPosition
    }

    it('cost 66 fuel to move from 16 to 5', () => {
      expect(crabFuelCostFromPositions(16, 5)).toEqual(66)
    })

    it('cost 10 fuel to move from 1 to 5', () => {
      expect(crabFuelCostFromPositions(1, 5)).toEqual(10)
    })

    it('costs a total of 168 fuel to move to postion 5', () => {
      expect(fuelCost(exampleData, 5)).toEqual(168)
    })

    it('finds the lowest fuel cost position to be 5', () => {
      expect(findingLowestFuelCost(exampleData)).toEqual(5)

      logResult(fuelCost(data, findingLowestFuelCost(data)))
    })
  })
})

run()
