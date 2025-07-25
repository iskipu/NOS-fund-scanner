import { PublicKey } from "@solana/web3.js";
import { TOKEN_ACCOUNT_ADDRESS } from "./config";
import {
  getATA,
  getTransactionsForAddress,
  getTransactionSummary,
  isNosanaTransaction,
} from "./solana";
import { type AccountsTable } from "./types";

async function findAccountsWithFiveTokenTransfers(
  fundingAccountAddress: string,
  mintAddress: string
): Promise<AccountsTable> {
  const accountsTable: AccountsTable = {};

  const tokenAccountOfFundingAddress = await getATA(
    fundingAccountAddress,
    mintAddress
  );

  const transactions = await getTransactionsForAddress(
    tokenAccountOfFundingAddress
  );
  // console.log(transactions);

  for (const tx of transactions) {
    const summary = getTransactionSummary(tx);
    for (const [owner, diff] of Object.entries(summary.receivers)) {
      if (diff === 5) {
        accountsTable[owner] = {
          ATA: (await getATA(owner, mintAddress)).toBase58(),
          counter: (accountsTable[owner]?.counter ?? 0) + 1,
        };
      }
    }
  }

  return accountsTable;
}

async function getSuspiciousAccounts(
  owner: string,
  ata: string
): Promise<string[]> {
  const suspiciousReceivers: string[] = [];
  const transactions = await getTransactionsForAddress(new PublicKey(ata));

  for (const tx of transactions) {
    if (isNosanaTransaction(tx)) {
      continue;
    }

    const summary = getTransactionSummary(tx);
    if (summary.senders[owner]) {
      suspiciousReceivers.push(...Object.keys(summary.receivers));
    }
  }

  return suspiciousReceivers;
}

import { setConnection } from "./solana";

export async function getNostronautsSummary() {
  const fundingAccountAddresses: string[] = JSON.parse(
    localStorage.getItem("fundingAccountAddresses") || "[]"
  );
  setConnection();
  const goodAccounts: Record<string, string> = {};
  const allAccounts: AccountsTable = {};
  for (const fundingAddress of fundingAccountAddresses) {
    const accounts = await findAccountsWithFiveTokenTransfers(
      fundingAddress,
      TOKEN_ACCOUNT_ADDRESS
    );
    for (const [key, value] of Object.entries(accounts)) {
      if (allAccounts[key]) {
        allAccounts[key].counter += value.counter;
      } else {
        allAccounts[key] = value;
      }
    }
  }

  const badAccounts: Record<string, any> = {};

  for (const [owner, info] of Object.entries(allAccounts)) {
    if (fundingAccountAddresses.includes(owner)) continue;

    const suspiciousReceivers = await getSuspiciousAccounts(owner, info.ATA);

    if (info.counter === 1 && suspiciousReceivers.length === 0) {
      goodAccounts[owner] = info.ATA;
      continue;
    }

    const reasons = [];
    if (info.counter > 1) {
      reasons.push(`Received funds ${info.counter} times`);
    }
    if (suspiciousReceivers.length > 0) {
      reasons.push(
        `Sent to suspicious accounts: ${suspiciousReceivers.join(", ")}`
      );
    }

    badAccounts[owner] = {
      ataAddress: info.ATA,
      remarks: reasons,
    };
  }

  return {
    goodAccounts,
    badAccounts,
    lastScannedTime: Date.now(),
  };
}
