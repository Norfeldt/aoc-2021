import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 8: Seven Segment Search ---', () => {
  //   0:      1:      2:      3:      4:
  //  aaaa    ....    aaaa    aaaa    ....
  // b    c  .    c  .    c  .    c  b    c
  // b    c  .    c  .    c  .    c  b    c
  //  ....    ....    dddd    dddd    dddd
  // e    f  .    f  e    .  .    f  .    f
  // e    f  .    f  e    .  .    f  .    f
  //  gggg    ....    gggg    gggg    ....
  //   6       2       5       5       4
  //
  //   5:      6:      7:      8:      9:
  //  aaaa    aaaa    aaaa    aaaa    aaaa
  // b    .  b    .  .    c  b    c  b    c
  // b    .  b    .  .    c  b    c  b    c
  //  dddd    dddd    ....    dddd    dddd
  // .    f  e    f  .    f  e    f  .    f
  // .    f  e    f  .    f  e    f  .    f
  //  gggg    gggg    ....    gggg    gggg
  //   5       6       3       7       6

  const exampleData = [
    'be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe',
    'edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc',
    'fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg',
    'fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb',
    'aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea',
    'fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb',
    'dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe',
    'bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef',
    'egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb',
    'gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce',
  ]
  const outputValues = (data: string[]): string[] => data.map((line) => line.split(' | ')[1])

  const data = Deno.readTextFileSync('08/data.txt').split('\n')

  function countUniqueSegments(segments: string[]): number {
    let count = 0
    for (const segment of segments) {
      count += segment.split(' ').reduce((acc: number, digits: string) => {
        const numberOfCharacters = digits.length
        if (
          numberOfCharacters === 2 ||
          numberOfCharacters === 3 ||
          numberOfCharacters === 4 ||
          numberOfCharacters === 7
        ) {
          acc += 1
        }
        return acc
      }, 0)
    }

    return count
  }

  describe('part 1: How many times do digits 1, 4, 7, or 8 appear', () => {
    it('gives 26 instances of digits that use a unique number of segments (the part after | on each line)', () => {
      expect(countUniqueSegments(outputValues(exampleData))).toEqual(26)

      logResult(countUniqueSegments(outputValues(data)))
    })
  })

  describe('part 2: Determine all of the wire/segment connections and decode the four-digit output values', () => {
    const decodeDictionary: Record<string, number> = {
      acedgfb: 8,
      cdfbe: 5,
      gcdfa: 2,
      fbcad: 3,
      dab: 7,
      cefabd: 9,
      cdfgeb: 6,
      eafb: 4,
      cagedb: 0,
      ab: 1,
    }

    const decodeDictionaryKeysCharactersSorted = Object.entries(decodeDictionary).reduce(
      (acc, [key, value]) => {
        const alphabeticalKey = key.split('').sort().join('')
        acc[alphabeticalKey] = value
        return acc
      },
      {} as Record<string, number>
    )

    function decodeInputs(input: string): Record<string, number> {
      const decodeDictionary: Record<string, number> = {}

      const keys: string[] = input
        .split(' ')
        .map((unsortedKey) => unsortedKey.split('').sort().join(''))

      const keyFor1 = keys.find((key) => key.length === 2) as string
      decodeDictionary[keyFor1] = 1

      const keyFor4 = keys.find((key) => key.length === 4) as string
      decodeDictionary[keyFor4] = 4

      const keyFor7 = keys.find((key) => key.length === 3) as string
      decodeDictionary[keyFor7] = 7

      const keyFor8 = keys.find((key) => key.length === 7) as string
      decodeDictionary[keyFor8] = 8

      const keysFor0or6or9 = keys.filter((key) => key.length === 6)
      const rightSideSegment = keyFor1.split('')
      const segmentsFor4 = keyFor4.split('')
      let keyFor6 = ''
      keysFor0or6or9.forEach((key) => {
        if (key.includes(rightSideSegment[0]) && key.includes(rightSideSegment[1])) {
          if (segmentsFor4.every((segment: string) => key.split('').includes(segment))) {
            decodeDictionary[key] = 9
          } else {
            decodeDictionary[key] = 0
          }
        } else {
          decodeDictionary[key] = 6
          keyFor6 = key
        }
      })

      const keysFor2or3or5 = keys.filter((key) => key.length === 5)
      const segmentsFor6 = keyFor6.split('')

      keysFor2or3or5.forEach((key) => {
        if (key.includes(rightSideSegment[0]) && key.includes(rightSideSegment[1])) {
          decodeDictionary[key] = 3
        } else {
          if (key.split('').every((segment: string) => segmentsFor6.includes(segment))) {
            decodeDictionary[key] = 5
          } else {
            decodeDictionary[key] = 2
          }
        }
      })

      return decodeDictionary
    }

    it('decodes to "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab" into a decode decodeDictionary', () => {
      expect(decodeInputs('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab')).toEqual(
        decodeDictionaryKeysCharactersSorted
      )
    })

    function decodeLine(line: string): number {
      const [inputs, outputs] = line.split(' | ')
      const decodeDictionary = decodeInputs(inputs)

      const sortedOutputs = outputs.split(' ').map((output) => output.split('').sort().join(''))

      const decodedResult = sortedOutputs
        .map((sortedOutput) => decodeDictionary[sortedOutput])
        .map(String)
        .join('')

      return Number(decodedResult)
    }

    it('decodes to "acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf" into a decode decodeDictionary', () => {
      expect(
        decodeLine(
          'acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'
        )
      ).toEqual(5353)

      const result = data.reduce((acc, line) => acc + decodeLine(line), 0)
      logResult(result)
    })
  })
})

run()
