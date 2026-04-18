/**
 * Supabase Error Handling Utilities
 * Provides better error messages and debugging for database operations
 */

export interface SupabaseError {
  message: string
  code?: string
  details?: string
  hint?: string
}

export interface OperationResult<T> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: string
    friendly_message: string
  }
}

/**
 * Parse Supabase error and return user-friendly message
 */
export function parseSupabaseError(error: any): {
  message: string
  friendly_message: string
  code?: string
} {
  if (!error) {
    return {
      message: 'Unknown error',
      friendly_message: 'An unexpected error occurred',
    }
  }

  const message = error.message || String(error)
  const code = error.code || error.status

  // Connection errors
  if (message.includes('Failed to fetch') || message.includes('ECONNREFUSED')) {
    return {
      message,
      friendly_message: 'Unable to reach the server. Please check your connection.',
      code: 'CONNECTION_ERROR',
    }
  }

  // Authentication errors
  if (code === 401 || message.includes('Unauthorized')) {
    return {
      message,
      friendly_message: 'Authentication failed. Please try again.',
      code: 'AUTH_ERROR',
    }
  }

  // Permission errors
  if (code === 403 || message.includes('permission')) {
    return {
      message,
      friendly_message: 'You do not have permission to perform this action.',
      code: 'PERMISSION_ERROR',
    }
  }

  // Not found
  if (code === 404 || message.includes('not found')) {
    return {
      message,
      friendly_message: 'The requested resource was not found.',
      code: 'NOT_FOUND',
    }
  }

  // Duplicate key (constraint violation)
  if (code === '23505' || message.includes('duplicate')) {
    return {
      message,
      friendly_message: 'This record already exists. Please use a different value.',
      code: 'DUPLICATE_KEY',
    }
  }

  // Foreign key violation
  if (code === '23503' || message.includes('foreign key')) {
    return {
      message,
      friendly_message: 'Invalid reference to related data.',
      code: 'FOREIGN_KEY_ERROR',
    }
  }

  // Default case
  return {
    message,
    friendly_message: 'An error occurred while processing your request. Please try again.',
    code: code || 'UNKNOWN',
  }
}

/**
 * Handle Supabase operation and return standardized result
 */
export async function handleSupabaseOperation<T>(
  operation: Promise<{ data: T | null; error: any }>
): Promise<OperationResult<T>> {
  try {
    const { data, error } = await operation

    if (error) {
      const parsedError = parseSupabaseError(error)
      return {
        success: false,
        error: {
          message: parsedError.message,
          code: parsedError.code,
          friendly_message: parsedError.friendly_message,
        },
      }
    }

    return {
      success: true,
      data: data as T,
    }
  } catch (error) {
    const parsedError = parseSupabaseError(error)
    return {
      success: false,
      error: {
        message: parsedError.message,
        code: parsedError.code,
        friendly_message: parsedError.friendly_message,
      },
    }
  }
}
