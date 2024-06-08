import { App } from 'vue'
import * as components from './components'

const install = (app: App) => {
  console.log(components)
}

export default {
  install
}

export * from './components'
export * as utils from './utils'


