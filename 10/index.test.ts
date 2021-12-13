import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts'
import { log, logResult } from '../helpers.ts'

describe('--- Day 10: Syntax Scoring ---', () => {
  const exampleData = [
    '[({(<(())[]>[[{[]{<()<>>',
    '[(()[<>])]({[<{<<[]>>(',
    '{([(<{}[<>[]}>{[]{[(<()>',
    '(((({<>}<{<{<>}{[]{[]{}',
    '[[<[([]))<([[{}[[()]]]',
    '[{[{({}]{}}([{[{{{}}([]',
    '{<[[]]>}<{[{[{[]{()[[[]',
    '[<(<(<(<{}))><([]([]()',
    '<{([([[(<>()){}]>(<<{{',
    '<{([{{}}[<[[[<>{}]]]>[]]',
  ]
  const data = Deno.readTextFileSync('10/data.txt').split('\n')

  const openCharacters = ['(', '[', '<', '{']
  const closeCharacters = [')', ']', '>', '}']
  const corruptedPairs = openCharacters.reduce((acc, openCharacter, openIndex) => {
    for (const [closeIndex, closeCharacter] of closeCharacters.entries()) {
      if (openIndex === closeIndex) {
        continue
      }
      acc = [...acc, openCharacter + closeCharacter]
    }
    return acc
  }, [] as string[])

  const illegalCaractersScore = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
  } as const

  function findFirstCorruptedPairOrReducedIncompletLine(input: string): string {
    let line = input
    const regexPairs = /(\(\))|(\{\})|(\[\])|(<>)/g
    let reducedLine = line.replace(regexPairs, '')
    while (line.length !== reducedLine.length) {
      line = reducedLine
      reducedLine = line.replace(regexPairs, '')
    }

    for (const corruptedPair of corruptedPairs) {
      if (line.includes(corruptedPair)) {
        return corruptedPair
      }
    }

    return line
  }

  function calculateSyntaxErrorScore(input: string): number {
    if (input.length != 2) {
      return 0
    }
    const key = input.split('')[1] as ')' | '}' | ']' | '>'
    return illegalCaractersScore[`${key}`]
  }

  describe('Syntax error in navigation subsystem on line: all of them', () => {
    describe('corrupted lines', () => {
      it('finds first corrupted pairs', () => {
        expect(findFirstCorruptedPairOrReducedIncompletLine(exampleData[2])).toEqual('[}')
        expect(findFirstCorruptedPairOrReducedIncompletLine(exampleData[4])).toEqual('[)')
        expect(findFirstCorruptedPairOrReducedIncompletLine(exampleData[5])).toEqual('(]')
        expect(findFirstCorruptedPairOrReducedIncompletLine(exampleData[7])).toEqual('<)')
        expect(findFirstCorruptedPairOrReducedIncompletLine(exampleData[8])).toEqual('[>')
      })

      it('calculate the corrupted lines score', () => {
        expect(
          calculateSyntaxErrorScore(findFirstCorruptedPairOrReducedIncompletLine(exampleData[2]))
        ).toEqual(1197)

        const exampleResult = exampleData.reduce((acc, line) => {
          const firstCorruptedPair = findFirstCorruptedPairOrReducedIncompletLine(line)
          return acc + calculateSyntaxErrorScore(firstCorruptedPair)
        }, 0)
        expect(exampleResult).toEqual(26397)

        const result = data.reduce((acc, line) => {
          const firstCorruptedPair = findFirstCorruptedPairOrReducedIncompletLine(line)
          return acc + calculateSyntaxErrorScore(firstCorruptedPair)
        }, 0)
        logResult(result)
      })
    })
  })

  function autoCompleteLine(line: string): string | null {
    const incompleteLine = findFirstCorruptedPairOrReducedIncompletLine(line)

    if (incompleteLine.length == 2) return null

    return incompleteLine
      .split('')
      .reverse()
      .join('')
      .replaceAll('(', ')')
      .replaceAll('[', ']')
      .replaceAll('<', '>')
      .replaceAll('{', '}')
  }

  const autoCompleteScoreDictionary = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
  }

  function completionStringScore(input: string): number {
    return input.split('').reduce((acc, char: keyof typeof autoCompleteScoreDictionary) => {
      return acc * 5 + (autoCompleteScoreDictionary[char] ?? 0)
    }, 0)
  }

  function middleAutoCompleteScore(lines: string[]): number {
    const scores: number[] = lines.reduce((acc, line) => {
      const closingLine = autoCompleteLine(line)
      if (closingLine == null) return acc
      return [...acc, completionStringScore(closingLine)]
    }, [] as number[])

    return scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)]
  }

  describe('incomplete lines', () => {
    it('finds the autocomplete string for an incomplete', () => {
      expect(autoCompleteLine(exampleData[3])).toEqual('}}>}>))))')
    })

    it('calculate the completion score for a autocomplete string', () => {
      expect(completionStringScore('])}>')).toEqual(294)
      expect(completionStringScore(']]}}]}]}>')).toEqual(995444)
    })

    it('finds the middle score', () => {
      expect(middleAutoCompleteScore(exampleData)).toEqual(288957)
      logResult(middleAutoCompleteScore(data))
    })
  })
})

run()
