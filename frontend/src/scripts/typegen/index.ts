import path from 'path'
import fs from 'fs/promises'

const __dirname = 'eventio/frontend'
const ICONS_PATH = path.resolve(__dirname, '../../src/components/base/icon/svgs')
const DTS_PATH = path.resolve(__dirname, '../../src/components/base/icon')
const DTS = 'icon.d.ts'

const generateDTS = (icons: string[]) => `/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
// This file was auto-generated. DO NOT MODIFY THIS FILE!

export type Icon =
  ${icons.map(icon => `'${icon}'`).join('\n  | ')}
`

const iconsTypeGen = async () => {
  const files = await fs.readdir(ICONS_PATH)
  const icons = files.filter(f => f.endsWith('.svg')).map(f => f.replace('.svg', ''))
  const content = generateDTS(icons)
  await fs.mkdir(DTS_PATH, { recursive: true })
  await fs.writeFile(path.join(DTS_PATH, DTS), content, 'utf-8')
  console.log('✅ icon.d.ts generated!')
}

iconsTypeGen()
