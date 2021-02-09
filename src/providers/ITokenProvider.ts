export interface ITokenProvider {
  generate(data: unknown): Promise<string>;
}
