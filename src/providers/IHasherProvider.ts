export interface IHasherProvider {
  encrypt(data: string): Promise<string>;
  decrypt(provided: string, stored: string): Promise<boolean>;
}
