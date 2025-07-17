import { ValidationError } from '@/types'

// Validation utility functions
export class ValidationUtils {
  static validateEmail(email: string): ValidationError[] {
    const errors: ValidationError[] = []
    
    if (!email) {
      errors.push({ field: 'email', message: 'Email is required' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push({ field: 'email', message: 'Invalid email format' })
    }
    
    return errors
  }

  static validateAmount(amount: number, fieldName = 'amount'): ValidationError[] {
    const errors: ValidationError[] = []
    
    if (amount === undefined || amount === null) {
      errors.push({ field: fieldName, message: `${fieldName} is required` })
    } else if (amount <= 0) {
      errors.push({ field: fieldName, message: `${fieldName} must be greater than 0` })
    } else if (amount > 1000000) {
      errors.push({ field: fieldName, message: `${fieldName} cannot exceed $1,000,000` })
    }
    
    return errors
  }

  static validateRequired(value: any, fieldName: string): ValidationError[] {
    const errors: ValidationError[] = []
    
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors.push({ field: fieldName, message: `${fieldName} is required` })
    }
    
    return errors
  }

  static validateDate(date: Date, fieldName = 'date'): ValidationError[] {
    const errors: ValidationError[] = []
    
    if (!date) {
      errors.push({ field: fieldName, message: `${fieldName} is required` })
    } else if (isNaN(date.getTime())) {
      errors.push({ field: fieldName, message: `Invalid ${fieldName}` })
    }
    
    return errors
  }

  static validatePercentages(percentages: number[]): ValidationError[] {
    const errors: ValidationError[] = []
    const total = percentages.reduce((sum, p) => sum + p, 0)
    
    if (Math.abs(total - 100) > 0.01) {
      errors.push({ field: 'splits', message: 'Percentages must sum to 100%' })
    }
    
    return errors
  }

  static validateSplitAmounts(amounts: number[], totalAmount: number): ValidationError[] {
    const errors: ValidationError[] = []
    const total = amounts.reduce((sum, a) => sum + a, 0)
    
    if (Math.abs(total - totalAmount) > 0.01) {
      errors.push({ field: 'splits', message: 'Split amounts must equal total expense amount' })
    }
    
    return errors
  }

  static roundToNearestCent(amount: number): number {
    return Math.round(amount * 100) / 100
  }
}