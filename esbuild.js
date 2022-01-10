const artifactOutputPath = 'infrastructure/dist';

require('esbuild')
  .build({
    entryPoints: ['src/index.ts'],
    tsconfig: './tsconfig.json',
    bundle: true,
    minify: true,
    sourcemap: false,
    outfile: `${artifactOutputPath}/main.js`,
    platform: 'node',
    target: 'node12'
  })
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
