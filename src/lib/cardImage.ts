import { toPng } from 'html-to-image'

/**
 * Export a card node to PNG at 2x and hand it to the OS share sheet.
 * Falls back to a download when the Web Share API cannot take files,
 * which is every desktop browser and some Android ones.
 */
export const shareCard = async (node: HTMLElement, filename: string): Promise<'shared' | 'downloaded' | 'failed'> => {
  try {
    const dataUrl = await toPng(node, {
      pixelRatio: 2,
      // The card has a tinted background; without this the export is
      // transparent and reads as clipped on light surfaces.
      backgroundColor: '#FAFAF7',
      cacheBust: true,
    })

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
