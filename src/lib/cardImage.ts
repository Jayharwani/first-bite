import { toPng } from 'html-to-image'

export type ShareResult = 'shared' | 'downloaded' | 'failed'

/** Inlining five weights of a webfont over a slow connection can crawl. */
const EXPORT_TIMEOUT_MS = 12000

const timeout = (ms: number) =>
  new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('export-timeout')), ms),
  )

/**
 * Export a card node to PNG at 2x and hand it to the OS share sheet.
 * Falls back to a download when the Web Share API cannot take files,
 * which is every desktop browser and some Android ones.
 *
 * The render is raced against a timeout: html-to-image resolves only once it
 * has inlined every webfont and decoded an SVG-embedded snapshot, and there
 * are real conditions where that never settles. Without the race the caller
 * would sit on a disabled button with no way back.
 */
export const shareCard = async (
  node: HTMLElement,
  filename: string,
): Promise<ShareResult> => {
  try {
    const dataUrl = await Promise.race([
      toPng(node, {
        pixelRatio: 2,
        // The card is a tinted surface; without an explicit background the
        // export is transparent and reads as clipped on light backgrounds.
        backgroundColor: '#FAFAF7',
        cacheBust: true,
      }),
      timeout(EXPORT_TIMEOUT_MS),
    ])

    const blob = await (await fetch(dataUrl)).blob()
    const file = new File([blob], filename, { type: 'image/png' })

    if (
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] }) &&
      typeof navigator.share === 'function'
    ) {
      await navigator.share({ files: [file], title: 'My First Bite review' })
      return 'shared'
    }

    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    a.click()
    return 'downloaded'
  } catch (err) {
    // A cancelled share sheet throws AbortError. That is not a failure.
    if (err instanceof Error && err.name === 'AbortError') return 'shared'
    return 'failed'
  }
}
