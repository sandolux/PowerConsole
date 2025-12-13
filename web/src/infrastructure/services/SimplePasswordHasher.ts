import { IPasswordHasher } from "@/core/domain/services/IPasswordHasher";

// Placeholder hasher: compares plain text with stored hash directly.
export class SimplePasswordHasher implements IPasswordHasher {
  async verify(plain: string, hash: string): Promise<boolean> {
    return plain === hash;
  }
}
