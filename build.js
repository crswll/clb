const esbuild = require('esbuild')

const config = ({ format }) => ({
  entryPoints: ['index.js'],
  outfile: `dist/index.${format}.js`,
  format: format,
  bundle: true,
  platform: 'node',
})

esbuild.buildSync(config({ format: 'cjs' }))
esbuild.buildSync(config({ format: 'esm' }))
