require('esbuild').buildSync({
  entryPoints: ['index.js'],
  outfile: 'dist/index.cjs.js',
  format: 'cjs',
  bundle: true,
  minify: true,
  platform: 'node',
})

require('esbuild').buildSync({
  entryPoints: ['index.js'],
  outfile: 'dist/index.esm.js',
  format: 'esm',
  bundle: true,
  minify: true,
  platform: 'node',
})
