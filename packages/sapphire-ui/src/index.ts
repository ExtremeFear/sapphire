import { App, Plugin } from 'vue'
import * as components from './components'

export * from './components'
export * as utils from './utils'

/**
 * global components register
 *
 * 视情况决定是否改用每个组件手动 import
 *
 */
const installPlugin: Plugin = {
  install(app: App) {
    Object.values(components).forEach((component) => {
      app.component(component.name as string, component)
    })
  },
}

export default installPlugin
