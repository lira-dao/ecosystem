import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: [
    'src/index.ts',
    'src/**/*.ts',
  ],
  splitting: true,
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  // minify: true,
  onSuccess: 'mkdir -p dist/abi/json && cp -R src/abi/json dist/abi/',
  ...options,
}));
