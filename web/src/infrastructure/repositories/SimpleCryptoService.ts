import { ICryptoService } from "../../../core/repositories/ICryptoService";

export class SimpleCryptoService implements ICryptoService {
  async encrypt(text: string): Promise<string> {
    // NOTE: This is a dummy implementation using Base64 for local development.
    // In a real application, a proper encryption library should be used.
    try {
      return Promise.resolve(btoa(text));
    } catch (error) {
      console.error("Failed to encrypt text:", error);
      // For environments where btoa is not available (like SSR in Node without polyfill)
      return Promise.resolve(Buffer.from(text).toString('base64'));
    }
  }

  async decrypt(hash: string): Promise<string> {
    // NOTE: This is a dummy implementation using Base64 for local development.
    try {
      return Promise.resolve(atob(hash));
    } catch (error) {
      console.error("Failed to decrypt hash:", error);
       // For environments where atob is not available
      return Promise.resolve(Buffer.from(hash, 'base64').toString('ascii'));
    }
  }
}
