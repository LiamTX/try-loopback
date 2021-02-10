export interface ITokenProvider {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generate(data: any): Promise<string>;
  verify(data: string): Promise<unknown>;
}
