import { defineConfig, type Options } from 'tsup';

export default defineConfig((options: Options) => ({
  entry: ['src/index.ts'],
  clean: true,
  dts: true,
  format: ['cjs'],
  onSuccess: 'mkdir -p dist/abi/json && cp -R src/abi/json dist/abi/',
  ...options,
}));
