// Simple in-memory store for used transaction signatures
// In a production app, this would be stored in a database
const usedTransactions = new Set<string>()

export function isTransactionUsed(transactionId: string): boolean {
  return usedTransactions.has(transactionId)
}

export function markTransactionAsUsed(transactionId: string): void {
  usedTransactions.add(transactionId)
}

// For development/testing only - allows checking the current state
export function getUsedTransactions(): string[] {
  return Array.from(usedTransactions)
}

