import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { bgBrightYellow, black } from 'https://deno.land/std/fmt/colors.ts'

const log = (mgs: string | number) => console.log(bgBrightYellow(black(` ${mgs} `)))
const logResult = (result: string | number) => log(`result: ${result}`)

describe('1st of december', () => {
  const exampleData = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]
  describe('the number of times a depth measurement increases', () => {
    const timesDepthMeasurementsIncrease = (depthMeasurements: number[]) => {
      let count = 0
      for (let i = 0; i < depthMeasurements.length - 1; i++) {
        if (depthMeasurements[i] < depthMeasurements[i + 1]) {
          count++
        }
      }
      return count
    }

    it('example yields 7 measurements that are larger than the previous', () => {
      expect(timesDepthMeasurementsIncrease(exampleData)).toEqual(7)
    })

    it('works for the challenge', () => {
      // read the data from the file line by line as one array of numbers
      const data = Deno.readTextFileSync('./01.data.part1.txt').split('\n').map(Number)

      const result = timesDepthMeasurementsIncrease(data)

      logResult(result)

      expect(typeof result).toEqual('number')
    })
  })

  describe('count the number of sums for three measurements in a row (sliding window) that are larger than the previous', () => {
    const timesDepthMeasurementsDecreaseInSlidingWindows = (depthMeasurements: number[]) => {
      const { decreaseCount } = depthMeasurements.reduce(
        (acc, value, index) => {
          const windowSum =
            acc.lastTwoMeasurements.reduce((acc: number, value: number) => acc + value, 0) + value
          acc.lastTwoMeasurements = [acc.lastTwoMeasurements[1], value]

          if (index < 3) {
            acc.previousWindowSum = windowSum
            return acc
          }

          if (windowSum > acc.previousWindowSum) {
            acc.decreaseCount++
          }
          acc.previousWindowSum = windowSum

          return acc
        },
        { decreaseCount: 0, previousWindowSum: 0, lastTwoMeasurements: [0, 0] } as {
          decreaseCount: number
          previousWindowSum: number
          lastTwoMeasurements: [number, number]
        }
      )

      return decreaseCount
    }

    it('example yields 5 sums are larger than the previous sum', () => {
      expect(timesDepthMeasurementsDecreaseInSlidingWindows(exampleData)).toEqual(5)
    })

    it('works for the 2nd part of the challenge', () => {
      // read the data from the file line by line as one array of numbers
      const data = Deno.readTextFileSync('./01.data.part1.txt').split('\n').map(Number)

      const result = timesDepthMeasurementsDecreaseInSlidingWindows(data)

      logResult(result)

      expect(typeof result).toEqual('number')
    })
  })
})

run()
