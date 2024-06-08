import fs from 'fs'
import path from 'path'

export const pathManager = {
  outputRoot: 'dist'
}

export const getDir = targetPath => {
  const components = fs.readdirSync(targetPath)

  return components
}

/**
 * 获取层级
 *
 */
export const getRelativePathLevel = (from, to) => {
  const relationPath = path.relative(from ,to)
  return relationPath.split(path.sep).length
}

export const genBuildOptions = ({ root, entry }, getRollOptions) => {
  const tasks = []
  const excludes = [ 'shims-vue.d.ts' ]
  /**
   * 判断该地址为 文件还是目录
   * 目录 -> 首先找到该目录下的 index.ts
   * 文件 -> 判断是否只是 格式转换 还是 编译
   * components/index.ts -> 格式转换 components/Button/index.ts 编译
   */
  const runner = (_options) => {
    const { root: _root, entry: _entry } = _options

    const dirs = fs.readdirSync(_entry).filter(name => !excludes.includes(name))

    if (dirs.length) {
      dirs.forEach(name => {
        const fullPath = path.join(_entry, name)
        const stat = fs.statSync(fullPath)

        if (stat.isDirectory()) {
          runner({ root: _root, entry: fullPath })
        }

        if (stat.isFile()) {
          const level = getRelativePathLevel(_root, fullPath)

          if (level >= 3 && name === 'index.ts') {
            // 文件编译
            tasks.push(...getRollOptions())
          }

          if (level < 3) {
            if (name === 'index.ts') {
              // 单纯转换
            }

            if (name !== 'index.ts') {
              // 文件编译
            }
          }
        }

        return
      })
    }
  }

  runner({ root, entry })

  return tasks
}
