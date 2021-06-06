const path = require('path')
const webpack = require('webpack')
const { createFsFromVolume, Volume } = require('memfs')

function compileAsync(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error || stats.hasErrors()) {
        const resolvedError = error || stats.toJson('errors-only')[0]
        reject(resolvedError.message)
      }

      resolve(stats)
    })
  })
}

it('converts "*.mp3" import into an audio player', async () => {
  const compiler = webpack({
    mode: 'development',
    entry: path.resolve(__dirname, '../src/index.js'),
    output: {
      filename: 'index.js',
    },
    module: {
      rules: [
        {
          test: /\.mp3$/,
          use: ['babel-loader', require.resolve('../src/mp3-loader.js')],
        },
        {
          test: /\.js$/,
          use: ['babel-loader'],
        },
      ],
    },
  })
  const memoryFs = createFsFromVolume(new Volume())
  compiler.outputFileSystem = memoryFs

  await compileAsync(compiler)

  expect(compiler.outputFileSystem.existsSync('dist/audio.mp3')).toEqual(true)

  const compiledCode = compiler.outputFileSystem.readFileSync(
    'dist/index.js',
    'utf8'
  )
  expect(compiledCode).toContain('.createElement(\\"audio\\"')
})
