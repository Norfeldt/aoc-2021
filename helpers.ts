import { bgBrightYellow, black } from 'https://deno.land/std/fmt/colors.ts'

export const log = (mgs: any) => console.log(bgBrightYellow(black(` ${mgs} `)))
export const logResult = (result: string | number) => log(`result: ${result}`)
