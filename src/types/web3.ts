export interface EIP1193Provider {
  isMetaMask?: boolean;
  request: (request: { method: string; params?: any[] | Record<string, any> }) => Promise<any>;
  on: (event: string, listener: (...args: any[]) => void) => void;
  removeListener: (event: string, listener: (...args: any[]) => void) => void;
}
