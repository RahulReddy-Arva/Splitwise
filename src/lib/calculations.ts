import { Expense, ExpenseSplit, Balance, Settlement } from '@/types'
import { ValidationUtils } from './validation'

export class ExpenseCalculations {
  // Calculate equal splits with proper rounding
  static calculateEqualSplits(amount: number, userIds: string[]): ExpenseSplit[] {
    if (userIds.length === 0) {
      throw new Error('At least one user is required for splitting')
    }

    const baseAmount = Math.floor((amount * 100) / userIds.length) / 100
    const remainder = ValidationUtils.roundToNearestCent(amount - (baseAmount * userIds.length))
    
    return userIds.map((userId, index) => ({
      userId,
      amount: index < remainder * 100 ? baseAmount + 0.01 : baseAmount,
    }))
  }

  // Calculate percentage-based splits
  static calculatePercentageSplits(
    amount: number, 
    splits: { userId: string; percentage: number }[]
  ): ExpenseSplit[] {
    const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0)
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error('Percentages must sum to 100%')
    }

    let totalAllocated = 0
    const result = splits.map((split) => {
      const splitAmount = ValidationUtils.roundToNearestCent((amount * split.percentage) / 100)
      totalAllocated += splitAmount
      
      return {
        userId: split.userId,
        amount: splitAmount,
        percentage: split.percentage,
      }
    })

    // Handle rounding errors by adjusting the largest split
    const difference = ValidationUtils.roundToNearestCent(amount - totalAllocated)
    if (Math.abs(difference) > 0.001) {
      const largestSplitIndex = result.reduce((maxIndex, split, index) => 
        split.amount > result[maxIndex].amount ? index : maxIndex, 0)
      result[largestSplitIndex].amount = ValidationUtils.roundToNearestCent(
        result[largestSplitIndex].amount + difference
      )
    }

    return result
  }

  // Calculate share-based splits
  static calculateShareSplits(
    amount: number, 
    splits: { userId: string; shares: number }[]
  ): ExpenseSplit[] {
    const totalShares = splits.reduce((sum, s) => sum + s.shares, 0)
    
    if (totalShares === 0) {
      throw new Error('Total shares must be greater than 0')
    }

    let totalAllocated = 0
    const result = splits.map((split) => {
      const splitAmount = ValidationUtils.roundToNearestCent((amount * split.shares) / totalShares)
      totalAllocated += splitAmount
      
      return {
        userId: split.userId,
        amount: splitAmount,
        shares: split.shares,
      }
    })

    // Handle rounding errors
    const difference = ValidationUtils.roundToNearestCent(amount - totalAllocated)
    if (Math.abs(difference) > 0.001) {
      const largestSplitIndex = result.reduce((maxIndex, split, index) => 
        split.amount > result[maxIndex].amount ? index : maxIndex, 0)
      result[largestSplitIndex].amount = ValidationUtils.roundToNearestCent(
        result[largestSplitIndex].amount + difference
      )
    }

    return result
  }

  // Validate exact amount splits
  static validateExactSplits(splits: ExpenseSplit[], totalAmount: number): boolean {
    const total = splits.reduce((sum, split) => sum + split.amount, 0)
    return Math.abs(total - totalAmount) < 0.01
  }
}

export class BalanceCalculations {
  // Calculate balances from expenses
  static calculateBalancesFromExpenses(expenses: Expense[]): Balance[] {
    const balanceMap = new Map<string, number>()

    // Process each expense
    expenses.forEach(expense => {
      // The payer is owed money
      expense.splits.forEach(split => {
        if (split.userId !== expense.paidBy) {
          const key = `${split.userId}->${expense.paidBy}`
          const reverseKey = `${expense.paidBy}->${split.userId}`
          
          const currentBalance = balanceMap.get(key) || 0
          const reverseBalance = balanceMap.get(reverseKey) || 0
          
          if (reverseBalance > 0) {
            // Net out against existing reverse balance
            const netAmount = split.amount - reverseBalance
            if (netAmount > 0) {
              balanceMap.set(key, netAmount)
              balanceMap.delete(reverseKey)
            } else if (netAmount < 0) {
              balanceMap.set(reverseKey, -netAmount)
              balanceMap.delete(key)
            } else {
              // They cancel out
              balanceMap.delete(reverseKey)
            }
          } else {
            balanceMap.set(key, currentBalance + split.amount)
          }
        }
      })
    })

    // Convert map to Balance objects
    const balances: Balance[] = []
    balanceMap.forEach((amount, key) => {
      if (amount > 0.01) { // Only include significant balances
        const [fromUser, toUser] = key.split('->')
        balances.push({
          id: `${fromUser}-${toUser}`,
          fromUser,
          toUser,
          amount: ValidationUtils.roundToNearestCent(amount),
          currency: 'USD', // TODO: Handle multiple currencies
          lastUpdated: new Date(),
        })
      }
    })

    return balances
  }

  // Optimize settlements to minimize number of transactions
  static optimizeSettlements(balances: Balance[]): Settlement[] {
    if (balances.length === 0) return []

    // Create a net balance map for each user
    const netBalances = new Map<string, number>()
    
    balances.forEach(balance => {
      const fromBalance = netBalances.get(balance.fromUser) || 0
      const toBalance = netBalances.get(balance.toUser) || 0
      
      netBalances.set(balance.fromUser, fromBalance - balance.amount)
      netBalances.set(balance.toUser, toBalance + balance.amount)
    })

    // Separate creditors and debtors
    const creditors: { userId: string; amount: number }[] = []
    const debtors: { userId: string; amount: number }[] = []

    netBalances.forEach((amount, userId) => {
      if (amount > 0.01) {
        creditors.push({ userId, amount })
      } else if (amount < -0.01) {
        debtors.push({ userId, amount: -amount })
      }
    })

    // Sort by amount (largest first) for better optimization
    creditors.sort((a, b) => b.amount - a.amount)
    debtors.sort((a, b) => b.amount - a.amount)

    // Generate optimized settlements
    const settlements: Settlement[] = []
    let creditorIndex = 0
    let debtorIndex = 0

    while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
      const creditor = creditors[creditorIndex]
      const debtor = debtors[debtorIndex]

      const settlementAmount = Math.min(creditor.amount, debtor.amount)
      
      if (settlementAmount > 0.01) {
        settlements.push({
          id: `${debtor.userId}-${creditor.userId}-${Date.now()}`,
          fromUser: debtor.userId,
          toUser: creditor.userId,
          amount: ValidationUtils.roundToNearestCent(settlementAmount),
          currency: 'USD',
        })

        creditor.amount -= settlementAmount
        debtor.amount -= settlementAmount
      }

      if (creditor.amount < 0.01) creditorIndex++
      if (debtor.amount < 0.01) debtorIndex++
    }

    return settlements
  }

  // Calculate net balance for a specific user
  static calculateUserNetBalance(balances: Balance[], userId: string): number {
    let netBalance = 0

    balances.forEach(balance => {
      if (balance.fromUser === userId) {
        netBalance -= balance.amount
      } else if (balance.toUser === userId) {
        netBalance += balance.amount
      }
    })

    return ValidationUtils.roundToNearestCent(netBalance)
  }
}

export class CurrencyUtils {
  private static exchangeRates: Map<string, number> = new Map([
    ['USD', 1.0],
    ['EUR', 0.85],
    ['GBP', 0.73],
    ['CAD', 1.25],
    ['AUD', 1.35],
  ])

  static convertCurrency(amount: number, fromCurrency: string, toCurrency: string): number {
    if (fromCurrency === toCurrency) return amount

    const fromRate = this.exchangeRates.get(fromCurrency) || 1
    const toRate = this.exchangeRates.get(toCurrency) || 1

    const usdAmount = amount / fromRate
    const convertedAmount = usdAmount * toRate

    return ValidationUtils.roundToNearestCent(convertedAmount)
  }

  static formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  static getSupportedCurrencies(): string[] {
    return Array.from(this.exchangeRates.keys())
  }
}