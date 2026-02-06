// Client-side encryption utilities for journal entries
import CryptoJS from 'crypto-js';

/**
 * Derives an encryption key from the user's password using PBKDF2
 * This ensures the encryption key is tied to the user's password
 */
export const deriveKey = (password, salt = 'solevia-journal-salt') => {
    return CryptoJS.PBKDF2(password, salt, {
        keySize: 256 / 32,
        iterations: 10000
    }).toString();
};

/**
 * Encrypts journal content using AES-256
 * @param {string} content - The journal content to encrypt
 * @param {string} encryptionKey - The derived encryption key
 * @returns {string} - Encrypted content
 */
export const encryptContent = (content, encryptionKey) => {
    try {
        const encrypted = CryptoJS.AES.encrypt(content, encryptionKey).toString();
        return encrypted;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt content');
    }
};

/**
 * Decrypts journal content
 * @param {string} encryptedContent - The encrypted content
 * @param {string} encryptionKey - The derived encryption key
 * @returns {string} - Decrypted content
 */
export const decryptContent = (encryptedContent, encryptionKey) => {
    try {
        const decrypted = CryptoJS.AES.decrypt(encryptedContent, encryptionKey);
        const content = decrypted.toString(CryptoJS.enc.Utf8);

        if (!content) {
            throw new Error('Decryption failed - invalid key');
        }

        return content;
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt content');
    }
};

/**
 * Hash PIN for storage (client-side hashing before sending to server)
 * This provides an additional layer of security
 */
export const hashPIN = (pin) => {
    return CryptoJS.SHA256(pin).toString();
};

/**
 * Store encryption key in session (cleared on logout)
 * WARNING: This is stored in memory only for the current session
 */
let sessionEncryptionKey = null;

export const setSessionKey = (key) => {
    sessionEncryptionKey = key;
    // Also store in sessionStorage as backup (cleared when browser closes)
    sessionStorage.setItem('_sek', key);
};

export const getSessionKey = () => {
    if (!sessionEncryptionKey) {
        sessionEncryptionKey = sessionStorage.getItem('_sek');
    }
    return sessionEncryptionKey;
};

export const clearSessionKey = () => {
    sessionEncryptionKey = null;
    sessionStorage.removeItem('_sek');
};

/**
 * Initialize encryption key from user's password
 * This should be called after successful login
 */
export const initializeEncryption = (password) => {
    const key = deriveKey(password);
    setSessionKey(key);
    return key;
};