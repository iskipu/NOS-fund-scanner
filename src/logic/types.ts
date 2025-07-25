export interface AccountInfo {
  counter: number;
  ATA: string;
}

export type AccountsTable = Record<string, AccountInfo>;

export type TransactionSummary = {
  senders: Record<string, number>;
  receivers: Record<string, number>;
};

export type CachedData<T> = {
  timestamp: number;
  data: T;
};
