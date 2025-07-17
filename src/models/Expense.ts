import { 
  Expense as ExpenseInterface, 
  ExpenseSplit, 
  ExpenseCategory, 
  SplitType,
  ValidationError 
} from '@/types'
import { ValidationUtils } from '@/lib/validation'
import { ExpenseCalculations } from '@/lib/calculations'

export class ExpenseModel implements ExpenseInterface {
  id: string
  description: string
  amount: number
  currency: string
  date: Date
  category: ExpenseCategory
  groupId?: string
  paidBy: string
  splits: ExpenseSplit[]
  receiptUrl?: string
  notes?: string
  createdAt: Date
  updatedAt: Date

  constructor(data: Partial<ExpenseInterface>) {
    this.id = data.id || ''
    this.description = data.description || ''
    this.amount = data.amount || 0
    this.currency = data.currency || 'USD'
    this.date = data.date || new Date()
    this.category = data.category || 'other'
    this.groupId = data.groupId
    this.paidBy = data.paidBy || ''
    this.splits = data.splits || []
    this.receiptUrl = data.receiptUrl
    this.notes = data.notes
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  validate(): ValidationError[] {
    const errors: ValidationError[] = []

    errors.push(...ValidationUtils.validateRequired(this.id, 'id'))
    errors.push(...ValidationUtils.validateRequired(this.description, 'description'))
    errors.push(...ValidationUtils.validateAmount(this.amount))
    errors.push(...ValidationUtils.validateRequired(this.currency, 'currency'))
    errors.push(...ValidationUtils.validateDate(this.date))
    errors.push(...ValidationUtils.validateRequired(this.paidBy, 'paidBy'))
    errors.push(...ValidationUtils.validateDate(this.createdAt, 'createdAt'))
    errors.push(...ValidationUtils.validateDate(this.updatedAt, 'updatedAt'))

    // Validate splits
    if (this.splits.length === 0) {
      errors.push({ field: 'splits', message: 'At least one split is required' })
    } else {
      const splitAmounts = this.splits.map(s => s.amount)
      errors.push(...ValidationUtils.validateSplitAmounts(splitAmounts, this.amount))
    }

    // Check for high amount confirmation requirement
    if (this.amount > 1000) {
      // This would trigger a confirmation dialog in the UI
    }

    return errors
  }

  // Use the centralized calculation functions
  static calculateEqualSplits = ExpenseCalculations.calculateEqualSplits
  static calculatePercentageSplits = ExpenseCalculations.calculatePercentageSplits  
  static calculateShareSplits = ExpenseCalculations.calculateShareSplits

  get formattedAmount(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amount)
  }

  get formattedDate(): string {
    return this.date.toLocaleDateString()
  }

  toJSON(): ExpenseInterface {
    return {
      id: this.id,
      description: this.description,
      amount: this.amount,
      currency: this.currency,
      date: this.date,
      category: this.category,
      groupId: this.groupId,
      paidBy: this.paidBy,
      splits: this.splits,
      receiptUrl: this.receiptUrl,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }

  static fromJSON(data: any): ExpenseModel {
    return new ExpenseModel({
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    })
  }
}