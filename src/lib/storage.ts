import { logError } from './error-handling';

export function getItem<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      return defaultValue;
    }
    return JSON.parse(storedValue) as T;
  } catch (error) {
    logError(`Error reading from localStorage for key "${key}"`, error, {
      key,
    });
    return defaultValue;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logError(`Error writing to localStorage for key "${key}"`, error, { key });
  }
}

export function initializeItem<T>(key: string, defaultValue: T): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const storedValue = window.localStorage.getItem(key);
    if (storedValue === null) {
      setItem(key, defaultValue);
    }
  } catch (error) {
    logError(`Error initializing localStorage for key "${key}"`, error, {
      key,
    });
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    logError(`Error removing localStorage key "${key}"`, error, { key });
  }
}
