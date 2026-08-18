import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { ALL_TOKENS, defaultValues } from '@/lib/design-tokens'

// Dev-only: lets the <DesignTokenEditor> "Save" button write its live
// overrides back into app/globals.css so they become the new checked-in
// defaults. Never reachable outside `next dev` — guarded below, and this
// whole route touches the filesystem so it must stay dev-only.
export const runtime = 'nodejs'

const GLOBALS_CSS_PATH = path.join(process.cwd(), 'app', 'globals.css')

function guardDev() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not available outside development' }, { status: 404 })
  }
  return null
}

/** Replace `--var: value;` occurrences, but only within [start, end) of `content`. */
function replaceVarsInRange(
  content: string,
  start: number,
  end: number,
  values: Record<string, string>
): string {
  const before = content.slice(0, start)
  let body = content.slice(start, end)
  const after = content.slice(end)

  for (const [name, value] of Object.entries(values)) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const re = new RegExp(`(${escaped}\\s*:\\s*)[^;]+(;)`, 'g')
    body = body.replace(re, (_match, pre, post) => `${pre}${value}${post}`)
  }

  return before + body + after
}

function findBlockRange(content: string, selectorStart: string): { start: number; end: number } | null {
  const idx = content.indexOf(selectorStart)
  if (idx === -1) return null
  const braceIdx = content.indexOf('{', idx)
  if (braceIdx === -1) return null
  const bodyStart = braceIdx + 1
  const bodyEnd = content.indexOf('\n}', bodyStart)
  if (bodyEnd === -1) return null
  return { start: bodyStart, end: bodyEnd }
}

export async function GET() {
  const denied = guardDev()
  if (denied) return denied

  return NextResponse.json({
    tokens: ALL_TOKENS,
    light: defaultValues('light'),
    dark: defaultValues('dark'),
  })
}

export async function POST(request: NextRequest) {
  const denied = guardDev()
  if (denied) return denied

  const knownVars = new Set(ALL_TOKENS.map((t) => t.var))

  let body: { light?: Record<string, string>; dark?: Record<string, string> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const light = Object.fromEntries(
    Object.entries(body.light ?? {}).filter(([k]) => knownVars.has(k))
  )
  const dark = Object.fromEntries(
    Object.entries(body.dark ?? {}).filter(([k]) => knownVars.has(k))
  )

  if (Object.keys(light).length === 0 && Object.keys(dark).length === 0) {
    return NextResponse.json({ error: 'No recognized tokens in body' }, { status: 400 })
  }

  let content: string
  try {
    content = await readFile(GLOBALS_CSS_PATH, 'utf-8')
  } catch (err) {
    return NextResponse.json({ error: `Could not read globals.css: ${(err as Error).message}` }, { status: 500 })
  }

  const themeRange = findBlockRange(content, '@theme {')
  const darkRange = findBlockRange(content, '.dark {')

  if (Object.keys(light).length > 0 && themeRange) {
    content = replaceVarsInRange(content, themeRange.start, themeRange.end, light)
  }
  if (Object.keys(dark).length > 0 && darkRange) {
    content = replaceVarsInRange(content, darkRange.start, darkRange.end, dark)
  }

  try {
    await writeFile(GLOBALS_CSS_PATH, content, 'utf-8')
  } catch (err) {
    return NextResponse.json({ error: `Could not write globals.css: ${(err as Error).message}` }, { status: 500 })
  }

  return NextResponse.json({ ok: true, savedLight: Object.keys(light), savedDark: Object.keys(dark) })
}
