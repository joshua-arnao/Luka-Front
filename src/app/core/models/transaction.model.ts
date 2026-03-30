export interface TransactionResponse {
  transactionId: string;
  amount: number;
  type: 'SEND' | 'RECEIVE';
  receiverEmail: string;
  createdAt: string;
}

export interface TransactionRequest {
  receiverWalletId: string;
  amount: number;
}
