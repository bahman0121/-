export interface Transaction {
  id: number;
  productName: string;
  weight: number;
  purchasePricePerKg: number;
  sellingPricePerKg: number;
  totalPurchasePrice: number;
  totalSellingPrice: number;
  profit: number;
}

export type NewTransaction = Omit<Transaction, 'id' | 'profit' | 'totalPurchasePrice' | 'totalSellingPrice'>;
