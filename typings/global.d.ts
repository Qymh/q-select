declare type obj = Record<string, any>;

declare module '.json' {
  const value: any;
  export default value;
}
