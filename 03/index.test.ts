import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 3: Binary Diagnostic ---', () => {
  const exampleData = [
    '00100',
    '11110',
    '10110',
    '10111',
    '10101',
    '01111',
    '00111',
    '11100',
    '10000',
    '11001',
    '00010',
    '01010',
  ]

  describe('part 1: find gamma rate and the epsilon rate to estimate power consumption', () => {
    function findGammaRate(data: string[]): string {
      const binaryScore = data.reduce((acc, value) => {
        return acc.map((score, index) => {
          const result = value[index] === '1' ? score + 1 : score - 1
          return result
        })
      }, new Array(data[0].length).fill(0) as number[])

      return binaryScore.map((score) => (score > 0 ? '1' : '0')).join('')
    }

    function invertBinaryString(str: string) {
      return str
        .split('')
        .map((char) => (char === '1' ? '0' : '1'))
        .join('')
    }

    it('finds the most common bit in the corresponding position of all numbers in the diagnostic report', () => {
      const exampleGammaRate = findGammaRate(exampleData)
      expect(exampleGammaRate).toEqual('10110')
      const exampleEpsilon = invertBinaryString(exampleGammaRate)
      expect(exampleEpsilon).toEqual('01001')

      const data = Deno.readTextFileSync('./03/data.txt').split('\n')
      const gammaRate = findGammaRate(data)
      const epsilonRate = invertBinaryString(gammaRate)

      logResult(
        `gamma rate: ${gammaRate} (${parseInt(gammaRate, 2)}); epsilon: ${epsilonRate} (${parseInt(
          epsilonRate,
          2
        )}); product: ${parseInt(gammaRate, 2) * parseInt(epsilonRate, 2)}`
      )
    })
  })

  describe('part 2: multiplying the oxygen generator rating by the CO2 scrubber rating', () => {
    it('finds the oxygen generator rating and CO2 scrubber rating', () => {
      const binaryScore = (data: string[]): number[] =>
        data.reduce((acc, value) => {
          return acc.map((score, index) => {
            const result = value[index] === '1' ? score + 1 : score - 1
            return result
          })
        }, new Array(data[0].length).fill(0) as number[])

      function findRatingByBitCriteria(
        data: string[],
        bitCriteria: (binaryScore: number[]) => string
      ): string[] {
        let index = 0
        let commonBits = bitCriteria(binaryScore(data))
        let reducedBits = data.filter((bit) => bit[index] === commonBits[index])
        while (reducedBits.length > 1) {
          index++
          commonBits = bitCriteria(binaryScore(reducedBits))
          reducedBits = reducedBits.filter((bit) => bit[index] === commonBits[index])
        }

        return reducedBits
      }

      const oxygenRatingBitCriteria = (binaryScore: number[]) =>
        binaryScore.map((score) => (score >= 0 ? '1' : '0')).join('')
      const co2ScrubberRatingBitCriteria = (binaryScore: number[]) =>
        binaryScore.map((score) => (score < 0 ? '1' : '0')).join('')

      expect(findRatingByBitCriteria(exampleData, oxygenRatingBitCriteria)).toEqual(['10111'])
      expect(findRatingByBitCriteria(exampleData, co2ScrubberRatingBitCriteria)).toEqual(['01010'])

      const data = Deno.readTextFileSync('./03/data.txt').split('\n')
      const oxygenRatingBinary = findRatingByBitCriteria(data, oxygenRatingBitCriteria)[0]
      const co2ScrubberRatingBinary = findRatingByBitCriteria(data, co2ScrubberRatingBitCriteria)[0]

      logResult(
        `life support rating: ${
          parseInt(oxygenRatingBinary, 2) * parseInt(co2ScrubberRatingBinary, 2)
        }`
      )
    })
  })
})

run()
