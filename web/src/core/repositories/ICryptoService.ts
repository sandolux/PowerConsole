export interface ICryptoService {
  encrypt(text: string): Promise<string>;
  decrypt(hash: string): Promise<string>;
}
