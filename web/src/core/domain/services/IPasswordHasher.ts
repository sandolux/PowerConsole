export interface IPasswordHasher {
  verify(plain: string, hash: string): Promise<boolean>;
}
