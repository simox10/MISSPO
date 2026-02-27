/**
 * Performance utilities to prevent forced reflows
 */

/**
 * Throttle function using requestAnimationFrame
 * Ensures function is called at most once per frame
 */
export function throttleRAF<T extends (...args: any[]) => void>(
  callback: T
): (...args: Parameters<T>) => void {
  let ticking = false

  return function (this: any, ...args: Parameters<T>) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback.apply(this, args)
        ticking = false
      })
      ticking = true
    }
  }
}

/**
 * Debounce function
 * Delays execution until after wait milliseconds have elapsed since last call
 */
export function debounce<T extends (...args: any[]) => void>(
  callback: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      callback.apply(this, args)
      timeoutId = null
    }, wait)
  }
}

/**
 * Batch DOM reads and writes to prevent layout thrashing
 * Reads are executed first, then writes
 */
export class DOMBatcher {
  private readQueue: Array<() => void> = []
  private writeQueue: Array<() => void> = []
  private scheduled = false

  read(callback: () => void) {
    this.readQueue.push(callback)
    this.schedule()
  }

  write(callback: () => void) {
    this.writeQueue.push(callback)
    this.schedule()
  }

  private schedule() {
    if (this.scheduled) return
    this.scheduled = true

    window.requestAnimationFrame(() => {
      // Execute all reads first
      const reads = this.readQueue.splice(0)
      reads.forEach(read => read())

      // Then execute all writes
      const writes = this.writeQueue.splice(0)
      writes.forEach(write => write())

      this.scheduled = false
    })
  }
}
