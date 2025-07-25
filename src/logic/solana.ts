import {
  PublicKey,
  type ConfirmedSignatureInfo,
  type ParsedTransactionWithMeta,
  Connection,
} from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  NOSANA_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "./config";
import { type TransactionSummary } from "./types";

let connection: Connection;

export function setConnection() {
  const rpcUrl = localStorage.getItem("rpcUrl");
  console.log("RPC URL being used by setConnection:", rpcUrl);
  connection = new Connection(rpcUrl || "https://api.mainnet-beta.solana.com");
}

export async function getATA(walletAddress: string, mintAddress: string) {
  const [ata] = await PublicKey.findProgramAddressSync(
    [
      new PublicKey(walletAddress).toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      new PublicKey(mintAddress).toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return ata;
}

async function getParsedTransactions(
  signatures: ConfirmedSignatureInfo[]
): Promise<ParsedTransactionWithMeta[]> {
  const CHUNK_SIZE = 9; // Process 10 signatures at a time
  const DELAY = 1100; // 1.1 seconds delay between chunks

  const allTransactions: (ParsedTransactionWithMeta | null)[] = [];

  for (let i = 0; i < signatures.length; i += CHUNK_SIZE) {
    const chunk = signatures.slice(i, i + CHUNK_SIZE);
    console.log(
      `Fetching transactions ${i + 1} to ${i + chunk.length} of ${
        signatures.length
      }`
    );
    const transactions = await Promise.all(
      chunk.map((s) =>
        connection.getParsedTransaction(s.signature, {
          maxSupportedTransactionVersion: 0,
        })
      )
    );
    allTransactions.push(...transactions);

    if (i + CHUNK_SIZE < signatures.length) {
      await new Promise((resolve) => setTimeout(resolve, DELAY));
    }
  }

  return allTransactions.filter(
    (tx) => tx !== null
  ) as ParsedTransactionWithMeta[];
}

export async function getSignaturesForAddress(address: PublicKey) {
  const untilSignature = localStorage.getItem("untilSignature");
  return connection.getSignaturesForAddress(address, {
    until: untilSignature || undefined, // Use undefined if null or empty string
  });
}

export async function getTransactionsForAddress(address: PublicKey) {
  console.log(`⚡ fetching transcations-${address.toBase58()} from source...`);
  const signatures = await getSignaturesForAddress(address);
  return getParsedTransactions(signatures);
}

export function getTransactionSummary(
  tx: ParsedTransactionWithMeta
): TransactionSummary {
  const summary: TransactionSummary = {
    senders: {},
    receivers: {},
  };

  if (!tx?.meta) return summary;

  const preToken = tx.meta.preTokenBalances ?? [];
  const postToken = tx.meta.postTokenBalances ?? [];

  // Build a lookup for pre balances
  const preMap = new Map();
  for (const pre of preToken) {
    const key = `${pre.owner}-${pre.mint}`;
    preMap.set(key, pre);
  }

  for (const post of postToken) {
    const key = `${post.owner}-${post.mint}`;
    const pre = preMap.get(key);

    const preAmount = Number(pre?.uiTokenAmount?.uiAmount ?? 0);
    const postAmount = Number(post.uiTokenAmount?.uiAmount ?? 0);
    const diff = postAmount - preAmount;

    if (diff === 0) continue;

    const owner = post.owner;
    if (!owner) continue; // make sure it's defined

    if (diff < 0) {
      summary.senders[owner] = (summary.senders[owner] ?? 0) + diff;
    } else {
      summary.receivers[owner] = (summary.receivers[owner] ?? 0) + diff;
    }
  }

  return summary;
}

export function isNosanaTransaction(tx: ParsedTransactionWithMeta): boolean {
  return tx.transaction.message.instructions.some(
    (instruction) => instruction.programId.toString() === NOSANA_PROGRAM_ID
  );
}
