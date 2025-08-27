import { Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Buffer } from 'buffer';

export async function handler(event, context) {
  const body = JSON.parse(event.body);
  const userWallet = body.userWallet;
  const betAmount = body.betAmount;

  // House wallet private key array
  const houseKey = [69,234,190,156,204,193,64,35,46,173,1,216,228,114,66,178,109,26,59,216,21,67,45,157,81,197,75,227,78,138,166,200,27,125,64,212,38,106,241,177,34,203,240,136,219,86,16,9,149,208,68,202,184,23,224,39,149,55,253,76,52,6,246,35];
  const house = Keypair.fromSecretKey(Uint8Array.from(houseKey));

  const connection = new Connection('https://api.mainnet-beta.solana.com');

  // Generate random multiplier (example: 0.5x to 3x)
  const multiplier = Math.random() * 2.5 + 0.5;
  const payoutAmount = betAmount * multiplier;

  // Attempt transaction
  try {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: house.publicKey,
        toPubkey: new PublicKey(userWallet),
        lamports: payoutAmount * LAMPORTS_PER_SOL,
      })
    );
    const signature = await sendAndConfirmTransaction(connection, transaction, [house]);
    return { statusCode: 200, body: JSON.stringify({ success: true, tx: signature, multiplier }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message, multiplier }) };
  }
}
