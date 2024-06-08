const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const { rollup } = require('rollup')
const vue = require('@vitejs/plugin-vue')
const alias = require('@rollup/plugin-alias')
const terser = require('@rollup/plugin-terser')
const postcss = require('rollup-plugin-postcss')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('@rollup/plugin-typescript')
const { nodeResolve } = require('@rollup/plugin-node-resolve')

const getTerser = () => {
  return null
  // return terser({ maxWorkers: 4 })
}

const getAlias = () => {
  return alias({
    entries: {
      '@': resolver('./src'),
      '@comps': resolver('./src/components'),
    }
  })
}

let moduleList = []
const entryFileName = 'index.ts'
const formatList = ['cjs', 'esm']
const root = path.resolve(__dirname, './src')
const dist = path.resolve(__dirname, './dist')
const resolver = (...args) => path.resolve(__dirname, ...args)

const rollupDefaultOption = {
  external: ['vue'],
  plugins: [
    vue(),
    getTerser(),
    commonjs(),
    typescript(),
    getAlias(),
    postcss({
      extract: 'style.css',
      minimize: true,
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

/**
 * 获取所有模块
 *
 * @returns {Promise<void>}
 */
const getModules = async () => {
  moduleList = fs.readdirSync(root).filter(file => fs.statSync(path.resolve(root, file)).isDirectory())

  await Promise.resolve()
}

/**
 * 构建 UMD 产物
 *
 * @returns {Promise<void>}
 * @constructor
 */
const UMDBuilder = async () => {
  const format = 'umd'

  const bundle = await rollup({
    ...rollupDefaultOption,
    input: path.join(root, entryFileName),
  })

  await bundle.write({
    format,
    exports: 'named',
    name: 'SapphireUI',
    globals: { vue: 'Vue' },
    file: path.join(dist, format, 'index.js')
  })
}

/**
 * 构建 CJS 与 ESM 产物
 *
 * @returns {Promise<void>}
 * @constructor
 */
const CJSESMBuilder = async () => {
  await Promise.all(moduleList.filter(item => item !== 'styles').map(module => {
    const dirNames = fs.readdirSync(path.resolve(root, module)).filter(name => name !== entryFileName)

    return dirNames.length ? new Promise(resolve => {
      dirNames.forEach(name => {
        const fullPath = path.resolve(root, module, name)
        const _fullPath = fs.statSync(fullPath).isFile() ? fullPath : (path.join(fullPath, entryFileName))

        rollup({...rollupDefaultOption, input: _fullPath})
          .then(bundle => {
            return Promise.all(formatList.map(format => bundle.write({
              format,
              sourcemap: true,
              file: path.resolve(dist, format, module, `${name.replace(/\.ts/, '')}.js`),
            })))
          }).then(resolve)
      })
    }) : null
  }))
}

/**
 * 转化且插入根入口及各模块入口文件
 *
 * @returns {Promise<void>}
 */
const injectEntriesFile = async () => {
  const entries = moduleList.reduce((acc, cur) => {
    acc.push({ scope: cur, name: entryFileName })
    return acc
  }, [{ scope: '', name: entryFileName }])

  await Promise.all(entries.map(entry => {
    const input = path.join(root, entry.scope, entry.name)

    return fs.existsSync(input) ? rollup({
      input,
      plugins: [getTerser(), typescript()],
      external: () => true
    }).then(bundle => {
      return Promise.all(formatList.map(format => bundle.write({
        format,
        exports: 'named',
        sourcemap: true,
        file: path.join(dist, format, entry.scope, entry.name.replace(/\.ts/, '.js'))
      })))
    }) : console.log(`\n[cli-injectEntriesFile]: ${input} 入口文件不存在，请检查!\n`)
  }))
}

exports.build = gulp.series(
  getModules,
  gulp.parallel(UMDBuilder, CJSESMBuilder, injectEntriesFile)
)


exports.dev = async () => {
  gulp.watch('src/components/**/*', gulp.series(
    getModules,
    gulp.parallel(CJSESMBuilder)
  ))
}
