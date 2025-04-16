"use client"

import { useState, useEffect } from "react"

type UseLocalStorageResult<T> = [T, (value: T) => void]

export function useLocalStorage<T>(key: string, initialValue: T): UseLocalStorageResult<T> {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(storedValue)
      window.localStorage.setItem(key, serializedValue)
    } catch (error) {
      console.error(error)
    }
  }, [key, storedValue])

  const setValue = (value: T) => {
    setStoredValue(value)
  }

  return [storedValue, setValue]
}
