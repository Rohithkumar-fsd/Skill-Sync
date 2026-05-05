import { useCallback, useState, useEffect, useRef } from 'react'

/**
 * Debounce hook - delays execution of a function
 */
export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}

/**
 * Throttle hook - limits execution frequency of a function
 */
export const useThrottle = <T,>(value: T, interval: number): T => {
  const [throttledValue, setThrottledValue] = useState<T>(value)
  const lastUpdated = useCallback(Date.now, [])

  useEffect(() => {
    const now = Date.now()

    if (now >= (lastUpdated as any) + interval) {
      setThrottledValue(value)
    }
  }, [value, interval, lastUpdated])

  return throttledValue
}

/**
 * Local storage hook - persist state to localStorage
 */
export const useLocalStorage = <T,>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        window.localStorage.setItem(key, JSON.stringify(value))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  return [storedValue, setValue]
}

/**
 * Previous value hook - keep track of previous value
 */
export const usePrevious = <T,>(value: T): T | undefined => {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

/**
 * Async hook - handle async operations
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<E | null>(null)

  const execute = useCallback(async () => {
    setStatus('pending')
    setValue(null)
    setError(null)

    try {
      const response = await asyncFunction()
      setValue(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as E)
      setStatus('error')
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { execute, status, value, error }
}

/**
 * Copy to clipboard hook
 */
export const useCopyToClipboard = (): [(text: string) => Promise<boolean>, boolean] => {
  const [copied, setCopied] = useState(false)

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      return false
    }
  }, [])

  return [copy, copied]
}
