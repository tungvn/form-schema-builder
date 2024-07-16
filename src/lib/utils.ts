import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CHUNK_SIZE = 1024 * 1024 * 10

export const splitFileToChunks = (file: File) => {
  const chunks: Blob[] = []
  let offset = 0

  while (offset < file.size) {
    chunks.push(file.slice(offset, offset + CHUNK_SIZE))
    offset += CHUNK_SIZE
  }

  return chunks
}

const THRESH = 1024
const FILE_SIZE_UNITS = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

export const humanFileSize = (bytes: number, decima: number = 1) => {
  if (bytes < THRESH) return `${bytes}B`

  let u = -1
  const r = 10 ** decima

  do {
    bytes /= THRESH
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= THRESH && u < FILE_SIZE_UNITS.length - 1)

  return bytes.toFixed(decima) + FILE_SIZE_UNITS[u]
}
