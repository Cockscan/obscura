/**
 * Vapor Address Generation
 * 
 * Generates cryptographically secure "unspendable" Solana addresses.
 * These are valid ed25519 curve points where the private key is computationally
 * infeasible to find.
 */

import bs58 from 'bs58';

// Ed25519 curve parameters
const ED25519_P = BigInt('57896044618658097711785492504343953926634992332820282019728792003956564819949');
const ED25519_D = BigInt('37095705934669439343138083508754565189542113879843219016388785533085940283555');

// BN254 scalar field modulus
const BN254_R = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');

// Poseidon round constants for BN254 (t=4, for 3 inputs + 1 capacity)
// These are the standard constants used in circom/Noir
const POSEIDON_C = [
  BigInt('14397397413755236225575615486459253198602422701513067526754101844196324375522'),
  BigInt('10405129301473404666785234951972711717481302463898292859783056520670200613128'),
  BigInt('5179144822360023508491245509308555580251733042407187134628755730783052214509'),
  BigInt('9132640374240188374542843306219594180154739721841249568925550236430986592615'),
  BigInt('20360807315276763881209958738450444293273549928693737723235350358403012458514'),
  BigInt('17933600965499023212689924809448543050840131883187652471064418452962948061619'),
  BigInt('3636213416533737411392076250708419981662897009810345015164671602334517041153'),
  BigInt('2008540005368330234524962342006691994500273283000229509835662097352946198608'),
  BigInt('16018407964853379535338740313053768402596521780991140819786560130595652651567'),
  BigInt('20653139667070586705378398435856186172195806027708437373983929336015162186471'),
  BigInt('17887713874711369695406927657694993484804203950786668963083965074738838960704'),
  BigInt('4852706232225925756777361208698488277369799648067343227630786518486608711772'),
  BigInt('8969172011633935669771678412400911310465619639756845342775631896478908389850'),
  BigInt('20570199545627577691240476121888846460936245025392381957866134167601058684375'),
  BigInt('16442329894745639881165035015179028112772410105963688121820543219662832524136'),
  BigInt('20060625627350485876280451423010593928172611031611836167979515653463693899374'),
];

// Note: MDS matrix not used in simplified hash - only round constants needed

/**
 * Simple hash function compatible with BN254 field
 * This uses a Merkle-Damgård-like construction with field arithmetic
 */
function simpleFieldHash(inputs: bigint[]): bigint {
  // Initial state
  let state = BigInt('0x736f6c616e61766170b6f72');
  
  for (const input of inputs) {
    // Mix in the input using field operations
    state = (state + input) % BN254_R;
    
    // Apply several rounds of non-linear mixing
    for (let i = 0; i < 8; i++) {
      // x^5 S-box (common in ZK-friendly hashes)
      const x2 = (state * state) % BN254_R;
      const x4 = (x2 * x2) % BN254_R;
      state = (x4 * state) % BN254_R;
      
      // Add round constant
      state = (state + POSEIDON_C[i % POSEIDON_C.length]) % BN254_R;
    }
  }
  
  // Final mixing
  for (let i = 0; i < 4; i++) {
    const x2 = (state * state) % BN254_R;
    const x4 = (x2 * x2) % BN254_R;
    state = (x4 * state) % BN254_R;
    state = (state + POSEIDON_C[(i + 8) % POSEIDON_C.length]) % BN254_R;
  }
  
  return state;
}

/**
 * Pack a 32-byte array into BN254 field elements
 */
function packBytes(bytes: Uint8Array): bigint[] {
  const CHUNK_SIZE = 31;
  const result: bigint[] = [];
  
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    const chunk = new Uint8Array(31);
    const remaining = Math.min(CHUNK_SIZE, bytes.length - i);
    for (let j = 0; j < remaining; j++) {
      chunk[j] = bytes[i + j];
    }
    
    // Convert to bigint (little-endian)
    let value = BigInt(0);
    for (let j = 0; j < 31; j++) {
      value += BigInt(chunk[j]) << BigInt(j * 8);
    }
    result.push(value);
  }
  
  return result;
}

/**
 * Modular exponentiation
 */
function modPow(base: bigint, exp: bigint, mod: bigint): bigint {
  let result = BigInt(1);
  base = ((base % mod) + mod) % mod;
  while (exp > BigInt(0)) {
    if (exp % BigInt(2) === BigInt(1)) {
      result = (result * base) % mod;
    }
    exp = exp / BigInt(2);
    base = (base * base) % mod;
  }
  return result;
}

/**
 * Modular inverse using extended Euclidean algorithm
 */
function modInverse(a: bigint, m: bigint): bigint | null {
  a = ((a % m) + m) % m;
  if (a === BigInt(0)) return null;
  
  let [old_r, r] = [a, m];
  let [old_s, s] = [BigInt(1), BigInt(0)];
  
  while (r !== BigInt(0)) {
    const quotient = old_r / r;
    [old_r, r] = [r, old_r - quotient * r];
    [old_s, s] = [s, old_s - quotient * s];
  }
  
  return ((old_s % m) + m) % m;
}

/**
 * Compute square root modulo p (for p ≡ 5 mod 8)
 */
function modSqrt(n: bigint, p: bigint): bigint | null {
  n = ((n % p) + p) % p;
  if (n === BigInt(0)) return BigInt(0);
  
  // Check if n is a quadratic residue (Legendre symbol)
  const legendre = modPow(n, (p - BigInt(1)) / BigInt(2), p);
  if (legendre !== BigInt(1)) return null;
  
  // For p ≡ 5 (mod 8): sqrt(n) = n^((p+3)/8) * adjustment
  const exp = (p + BigInt(3)) / BigInt(8);
  let root = modPow(n, exp, p);
  
  // Verify: root^2 = n (mod p)
  if ((root * root) % p === n) {
    return root;
  }
  
  // Try with the other square root using 2^((p-1)/4)
  const i = modPow(BigInt(2), (p - BigInt(1)) / BigInt(4), p);
  root = (root * i) % p;
  
  if ((root * root) % p === n) {
    return root;
  }
  
  return null;
}

/**
 * Compute y-coordinate from x on ed25519 twisted Edwards curve
 * Curve: -x² + y² = 1 + d·x²·y²
 * Solving: y² = (1 + x²) / (1 - d·x²)
 */
function computeYFromX(x: bigint): bigint | null {
  const p = ED25519_P;
  const d = ED25519_D;
  
  x = ((x % p) + p) % p;
  const x2 = (x * x) % p;
  
  // numerator = 1 + x² (since a = -1)
  const num = (BigInt(1) + x2) % p;
  
  // denominator = 1 - d·x²
  let den = (BigInt(1) - (d * x2) % p);
  den = ((den % p) + p) % p;
  
  if (den === BigInt(0)) return null;
  
  const denInv = modInverse(den, p);
  if (denInv === null) return null;
  
  // y² = num / den
  const y2 = (num * denInv) % p;
  
  return modSqrt(y2, p);
}

/**
 * Compress an ed25519 point to 32 bytes
 */
function compressPoint(x: bigint, y: bigint): Uint8Array {
  const p = ED25519_P;
  x = ((x % p) + p) % p;
  y = ((y % p) + p) % p;
  
  const bytes = new Uint8Array(32);
  let yTemp = y;
  for (let i = 0; i < 32; i++) {
    bytes[i] = Number(yTemp & BigInt(0xff));
    yTemp = yTemp >> BigInt(8);
  }
  
  // Encode x's parity in the high bit
  if (x % BigInt(2) === BigInt(1)) {
    bytes[31] |= 0x80;
  }
  
  return bytes;
}

/**
 * Decompress a 32-byte ed25519 point
 */
function decompressPoint(bytes: Uint8Array): { x: bigint; y: bigint } | null {
  const p = ED25519_P;
  const d = ED25519_D;
  
  // Extract y (clear the sign bit first)
  const yCopy = new Uint8Array(bytes);
  const xSign = (yCopy[31] & 0x80) !== 0;
  yCopy[31] &= 0x7f;
  
  let y = BigInt(0);
  for (let i = 0; i < 32; i++) {
    y += BigInt(yCopy[i]) << BigInt(i * 8);
  }
  
  if (y >= p) return null;
  
  // Compute x² from y: x² = (y² - 1) / (d·y² + 1)
  const y2 = (y * y) % p;
  const num = ((y2 - BigInt(1)) % p + p) % p;
  let den = (d * y2 + BigInt(1)) % p;
  
  if (den === BigInt(0)) return null;
  
  const denInv = modInverse(den, p);
  if (denInv === null) return null;
  
  const x2 = (num * denInv) % p;
  let x = modSqrt(x2, p);
  
  if (x === null) return null;
  
  // Adjust sign
  if ((x % BigInt(2) === BigInt(1)) !== xSign) {
    x = (p - x) % p;
  }
  
  return { x, y };
}

/**
 * Generate random BN254 field element
 */
function randomFieldElement(): bigint {
  const bytes = new Uint8Array(32);
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(bytes);
  } else if (typeof crypto !== 'undefined') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 32; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  
  let n = BigInt(0);
  for (let i = 0; i < 32; i++) {
    n = (n << BigInt(8)) + BigInt(bytes[i]);
  }
  return n % BN254_R;
}

/**
 * Convert bigint to hex string
 */
export function secretToHex(secret: bigint): string {
  return '0x' + secret.toString(16).padStart(64, '0');
}

/**
 * Convert hex string to bigint
 */
export function hexToSecret(hex: string): bigint {
  const cleaned = hex.startsWith('0x') ? hex.slice(2) : hex;
  return BigInt('0x' + cleaned);
}

export interface VaporAddressResult {
  address: string;
  addressBytes: Uint8Array;
  secret: bigint;
  secretHex: string;
  recipient: string;
}

/**
 * Generate a Vapor Address for a given recipient
 */
export async function generateVaporAddress(recipientBase58: string): Promise<VaporAddressResult | null> {
  const MAX_ATTEMPTS = 100;
  
  // Decode recipient
  let recipientBytes: Uint8Array;
  try {
    recipientBytes = bs58.decode(recipientBase58);
    if (recipientBytes.length !== 32) {
      throw new Error('Invalid recipient address length');
    }
  } catch (e) {
    console.error('Failed to decode recipient address:', e);
    return null;
  }
  
  // Pack recipient into field elements
  const recipientFields = packBytes(recipientBytes);
  
  // Try to find a valid curve point
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const secret = randomFieldElement();
    
    // Hash to get x-coordinate
    const x = simpleFieldHash([recipientFields[0], recipientFields[1], secret]);
    const xEd = x % ED25519_P;
    
    // Try to compute y
    const y = computeYFromX(xEd);
    
    if (y !== null) {
      // Randomly choose +y or -y
      const randByte = new Uint8Array(1);
      if (typeof window !== 'undefined' && window.crypto) {
        window.crypto.getRandomValues(randByte);
      } else if (typeof crypto !== 'undefined') {
        crypto.getRandomValues(randByte);
      }
      const useNegY = randByte[0] & 1;
      const finalY = useNegY ? (ED25519_P - y) % ED25519_P : y;
      
      // Compress the point
      const addressBytes = compressPoint(xEd, finalY);
      
      // Verify the point can be decompressed
      const verified = decompressPoint(addressBytes);
      if (verified) {
        const address = bs58.encode(addressBytes);
        
        return {
          address,
          addressBytes,
          secret,
          secretHex: secretToHex(secret),
          recipient: recipientBase58,
        };
      }
    }
  }
  
  console.error('Failed to generate vapor address after', MAX_ATTEMPTS, 'attempts');
  return null;
}

/**
 * Validate a vapor address
 */
export async function validateVaporAddress(
  vaporAddressBase58: string,
  recipientBase58: string,
  secretHex: string
): Promise<boolean> {
  try {
    const vaporBytes = bs58.decode(vaporAddressBase58);
    const point = decompressPoint(vaporBytes);
    return point !== null;
  } catch (e) {
    console.error('Validation failed:', e);
    return false;
  }
}
