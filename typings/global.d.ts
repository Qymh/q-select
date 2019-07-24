declare type obj = {
  [key: string]: any;
};

declare module '.json' {
  const value: any;
  export default value;
}

declare module 'rollup-plugin-typescript' {
  const exportAs: any;
  export = exportAs;
}

declare module 'rollup-plugin-postcss' {
  const exportAs: any;
  export = exportAs;
}

declare module 'rollup-plugin-json' {
  const exportAs: any;
  export = exportAs;
}

declare module 'rollup-plugin-serve' {
  const exportAs: any;
  export = exportAs;
}

declare module 'rollup-plugin-livereload' {
  const exportAs: any;
  export = exportAs;
}
