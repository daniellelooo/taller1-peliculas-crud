import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    // Resuelve los alias declarados en tsconfig.json.
    tsconfigPaths(),
    // Necesario para que los decoradores de Nest conserven su metadata.
    swc.vite({ module: { type: 'es6' } }),
  ],
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
  },
});
