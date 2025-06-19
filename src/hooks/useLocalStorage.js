// src/hooks/useLocalStorage.js
import { useCallback } from 'react';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'your-secret-key'; // Replace with a secure key (store in env in real apps)

export const useLocalStorage = (key, initialValue) => {
	const getValue = useCallback(() => {
		try {
			const encryptedItem = window.localStorage.getItem(key);
			if (!encryptedItem) return initialValue;

			// Decrypt
			const bytes = CryptoJS.AES.decrypt(encryptedItem, SECRET_KEY);
			const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
			if (!decryptedString) throw new Error('Decryption failed');

			return JSON.parse(decryptedString);
		} catch (error) {
			console.error(`[useLocalStorage] Error reading key "${key}":`, error);
			return initialValue;
		}
	}, [key, initialValue]);

	const setValue = useCallback(
		(value) => {
			try {
				const valueToStore =
					typeof value === 'function' ? value(getValue()) : value;
				const encrypted = CryptoJS.AES.encrypt(
					JSON.stringify(valueToStore),
					SECRET_KEY
				).toString();
				window.localStorage.setItem(key, encrypted);
			} catch (error) {
				console.error(`[useLocalStorage] Error setting key "${key}":`, error);
			}
		},
		[key, getValue]
	);

	const removeValue = useCallback(() => {
		try {
			window.localStorage.removeItem(key);
		} catch (error) {
			console.error(`[useLocalStorage] Error removing key "${key}":`, error);
		}
	}, [key]);

	return [getValue, setValue, removeValue];
};
