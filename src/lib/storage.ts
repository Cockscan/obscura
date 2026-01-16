/**
 * Local Storage for Vapor Addresses
 * 
 * Stores vapor address secrets locally so users can reclaim their tokens.
 * WARNING: This is browser-only storage. Users should back up their secrets.
 */

const STORAGE_KEY = 'obscura_vapor_addresses';

export interface StoredVaporAddress {
  id: string;
  vaporAddress: string;      // The unspendable address (base58)
  recipientAddress: string;  // Your real wallet address
  secretHex: string;         // The secret needed to prove ownership
  createdAt: number;         // Unix timestamp
  amount?: number;           // Deposited amount (if known)
  depositTxId?: string;      // Transaction ID of deposit (if known)
  status: 'pending' | 'deposited' | 'condensed';
}

/**
 * Get all stored vapor addresses
 */
export function getStoredVaporAddresses(): StoredVaporAddress[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load vapor addresses:', e);
    return [];
  }
}

/**
 * Get vapor addresses for a specific wallet
 */
export function getVaporAddressesForWallet(walletAddress: string): StoredVaporAddress[] {
  return getStoredVaporAddresses().filter(va => va.recipientAddress === walletAddress);
}

/**
 * Save a new vapor address
 */
export function saveVaporAddress(address: Omit<StoredVaporAddress, 'id' | 'createdAt' | 'status'>): StoredVaporAddress {
  const addresses = getStoredVaporAddresses();
  
  const newAddress: StoredVaporAddress = {
    ...address,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    status: 'pending',
  };
  
  addresses.push(newAddress);
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }
  
  return newAddress;
}

/**
 * Update a vapor address (e.g., mark as deposited with amount)
 */
export function updateVaporAddress(id: string, updates: Partial<StoredVaporAddress>): StoredVaporAddress | null {
  const addresses = getStoredVaporAddresses();
  const index = addresses.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  addresses[index] = { ...addresses[index], ...updates };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
  }
  
  return addresses[index];
}

/**
 * Mark a vapor address as condensed (withdrawn)
 */
export function markAsCondensed(id: string): boolean {
  const result = updateVaporAddress(id, { status: 'condensed' });
  return result !== null;
}

/**
 * Delete a vapor address
 */
export function deleteVaporAddress(id: string): boolean {
  const addresses = getStoredVaporAddresses();
  const filtered = addresses.filter(a => a.id !== id);
  
  if (filtered.length === addresses.length) return false;
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
  
  return true;
}

/**
 * Export all vapor addresses (for backup)
 */
export function exportVaporAddresses(): string {
  const addresses = getStoredVaporAddresses();
  return JSON.stringify(addresses, null, 2);
}

/**
 * Import vapor addresses from backup
 */
export function importVaporAddresses(json: string): number {
  try {
    const imported = JSON.parse(json) as StoredVaporAddress[];
    const existing = getStoredVaporAddresses();
    
    // Merge, avoiding duplicates by vapor address
    const existingAddrs = new Set(existing.map(a => a.vaporAddress));
    const newAddresses = imported.filter(a => !existingAddrs.has(a.vaporAddress));
    
    const merged = [...existing, ...newAddresses];
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
    
    return newAddresses.length;
  } catch (e) {
    console.error('Failed to import vapor addresses:', e);
    return 0;
  }
}

/**
 * Clear all stored vapor addresses (dangerous!)
 */
export function clearAllVaporAddresses(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
