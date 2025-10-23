export interface AppError {
  message: string;
  code?: string;
  context?: Record<string, unknown>;
}

export function logError(
  message: string,
  error?: unknown,
  context?: Record<string, unknown>
): void {
  const errorInfo: AppError = {
    message,
    context,
  };

  if (error instanceof Error) {
    errorInfo.code = error.name;
    console.error(message, {
      ...errorInfo,
      stack: error.stack,
      originalError: error.message,
    });
  } else {
    console.error(message, errorInfo);
  }
}

export async function handleAsyncError<T>(
  operation: () => Promise<T>,
  errorMessage: string,
  context?: Record<string, unknown>
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    logError(errorMessage, error, context);
    return null;
  }
}

export async function handleAsyncErrorOrThrow<T>(
  operation: () => Promise<T>,
  errorMessage: string,
  context?: Record<string, unknown>
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logError(errorMessage, error, context);
    throw error;
  }
}
