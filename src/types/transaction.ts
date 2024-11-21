export interface ITransactionDb {
  transaction_time?: string;
  transaction_bank_id?: string;
  transaction_description?: string;
  transaction_code?: string;
  amount?: number;
  status?: string;
  user_id?: string;
}

export interface ITransactionMbbank {
  transactionID: string;
  amount: number;
  description: string;
  transactionDate: string;
  type: string;
}
