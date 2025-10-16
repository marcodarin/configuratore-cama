import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converte un URL di Google Drive nel formato corretto per visualizzare direttamente l'immagine
 * @param url - L'URL dell'immagine (può essere un link di Google Drive o un URL normale)
 * @returns URL convertito per la visualizzazione diretta
 * 
 * Esempi di conversione:
 * Input: https://drive.google.com/file/d/1JnnJkgZRNeF0DxUhmh0N-ogfe5nWttSv/view?usp=drive_link
 * Output: https://drive.google.com/uc?export=view&id=1JnnJkgZRNeF0DxUhmh0N-ogfe5nWttSv
 */
export function convertGoogleDriveUrl (url: string): string {
  if (!url) return url

  // Pattern per riconoscere link di Google Drive
  const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)

  if (match && match[1]) {
    // Estrae il FILE_ID e crea l'URL diretto
    const fileId = match[1]
    return `https://drive.google.com/uc?export=view&id=${fileId}`
  }

  // Se non è un link di Google Drive, restituisce l'URL originale
  return url
}
