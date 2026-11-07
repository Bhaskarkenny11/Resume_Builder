declare module 'mammoth' {
  export interface RawTextResult {
    value: string;
    messages: any[];
  }
  export interface MammothOptions {
    arrayBuffer?: ArrayBuffer;
    buffer?: any;
    path?: string;
  }
  export function extractRawText(options: MammothOptions): Promise<RawTextResult>;
  export function convertToHtml(options: MammothOptions): Promise<{ value: string; messages: any[] }>;
}
