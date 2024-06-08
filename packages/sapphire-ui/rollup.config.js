const fs = require('fs')
const path = require('path')

const vue = require('@vitejs/plugin-vue')
const alias = require('@rollup/plugin-alias')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const isDEV = process.env.NODE_ENV === 'development'

const getTerser = () => isDEV ? null : terser({ maxWorkers: 4 })

const getAlias = () => {
  return alias({
    entries: {
      '@': resolver('./src'),
      '@comps': resolver('./src/components'),
    }
  })
}

const entryFileName = 'index.ts'
const formatList = isDEV ? ['esm'] : ['esm', 'cjs']
const root = path.resolve(__dirname, './src')
const dist = path.resolve(__dirname, './dist')
const resolver = (...args) => path.resolve(__dirname, ...args)
let moduleList = fs.readdirSync(root).filter(file => fs.statSync(path.resolve(root, file)).isDirectory())

const rollupDefaultOption = {
  external: [isDEV && 'vue'].filter(Boolean),
  plugins: [
    vue(),
    commonjs(),
    getAlias(),
    getTerser(),
    typescript(),
    postcss({
      minimize: true,
      extract: 'style.css',
      extensions: ['.css'],
      plugins: [
        require('autoprefixer')
      ]
    }),
    nodeResolve({
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    })
  ].filter(Boolean)
}

const UMDBuilder = () => {
  if (isDEV) { return [] }

  const format = 'umd'

  return [
    {
      ...rollupDefaultOption,
      input: path.join(root, entryFileName),
      output: {
        format,
        exports: 'named',
        name: 'SapphireUI',
        globals: { vue: 'Vue' },
        file: path.join(dist, format, 'index.js')
      }
    }
  ]
}

const CJSESMBuilder = () => {
  return moduleList.filter(item => item !== 'styles').reduce((options, module) => {
    const dirNames = fs.readdirSync(path.resolve(root, module)).filter(name => name !== entryFileName)

    dirNames.forEach(name => {
      const fullPath = path.resolve(root, module, name)
      const _fullPath = fs.statSync(fullPath).isFile() ? fullPath : (path.join(fullPath, entryFileName))

      options.push({
        ...rollupDefaultOption,
        input: _fullPath,
        output: formatList.map(format => ({
          format,
          sourcemap: !isDEV,
          file: path.resolve(dist, format, module, `${name.replace(/\.ts/, '')}.js`),
        }))
      })
    })

    return options
  }, [])
}

const injectEntriesFile = () => {
  const options = []
  const entries = moduleList.reduce((acc, cur) => {
    acc.push({ scope: cur, name: entryFileName })
    return acc
  }, [{ scope: '', name: entryFileName }])

  entries.forEach(entry => {
    const input = path.join(root, entry.scope, entry.name)
    const isExist = fs.existsSync(input)

    isExist
      ? options.push({
        input,
        external: () => true,
        plugins: [getTerser(), typescript()],
        output: formatList.map(format => ({
          format,
          exports: 'named',
          sourcemap: !isDEV,
          file: path.join(dist, format, entry.scope, entry.name.replace(/\.ts/, '.js'))
        }))
      }) : console.warn(`\n[cli-injectEntriesFile]: ${input} 入口文件不存在，请检查!\n`)
  })

  return options
}


exports.default = [
  ...UMDBuilder(),
  ...CJSESMBuilder(),
  ...injectEntriesFile()
]
