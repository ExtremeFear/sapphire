/**
 * rollup.config.js
 *
 */

const fs = require('fs')
const path = require('path')

const vue = require('@vitejs/plugin-vue')
const alias = require('@rollup/plugin-alias')
const eslint = require('@rollup/plugin-eslint')
const terser = require('@rollup/plugin-terser')
const vueJsx = require('@vitejs/plugin-vue-jsx')
const postcss = require('rollup-plugin-postcss')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const isDEV = process.env.NODE_ENV === 'development'
const getTerser = () => {
  return null
  return isDEV ? null : terser({ maxWorkers: 4 })
}
const entryFileName = 'index.ts'
const root = path.resolve(__dirname, './src')
const dist = path.resolve(__dirname, './dist')
const formatList = isDEV ? ['esm'] : ['esm', 'cjs']
const resolver = (...args) => path.resolve(__dirname, ...args)
const getFileName = name => name.replace(new RegExp(`${path.extname(name)}`), '')
const moduleList = fs.readdirSync(root).filter(file => fs.statSync(path.resolve(root, file)).isDirectory())
const _alias = alias({
  entries: {
    '@': resolver('./src'),
    '@comps': resolver('./src/components'),
  }
})


const postcssPlugin = postcss({
  minimize: true,
  autoModules: true,
  extract: isDEV ? false : 'index.min.css',
  plugins: [
    require('postcss-import')({
      resolve: (id) => {
        if (id.startsWith('@')) {
          return root + id.slice(1)
        }

        return id
      }
    }),
    require('tailwindcss'),
    require('autoprefixer')
  ]
})

const rollupDefaultOption = {
  external: ['vue'],
  plugins: [
    nodeResolve({
      browser: true,
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.vue'],
    }),
    commonjs(),
    vue(),
    vueJsx(),
    postcssPlugin,
    eslint({
      exclude: ['node_modules/**'],
      include: 'src/**/*.{js,jsx,ts,tsx,vue}'
    }),
    _alias,
    getTerser(),
    typescript(),
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
  const result = moduleList.filter(item => item !== 'styles').reduce((options, module) => {
    const dirNames = fs.readdirSync(path.resolve(root, module)).filter(name => name !== entryFileName)

    dirNames.forEach(name => {
      const fullPath = path.resolve(root, module, name)
      options.input[`${module}/${getFileName(name)}`] = fs.statSync(fullPath).isFile()
        ? fullPath
        : path.join(fullPath, entryFileName)
    })

    return options
  }, {
    input: {},
    ...rollupDefaultOption,
    output: formatList.map(format => ({
      format,
      sourcemap: !isDEV,
      dir: path.resolve(dist, format),
      entryFileNames: chunkInfo => [chunkInfo.name, 'index.js'].join('/')
    }))
  })

  return [result]
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
          file: path.join(dist, format, entry.scope, `${getFileName(entry.name)}.js`)
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
