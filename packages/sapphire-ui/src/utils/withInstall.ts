import type { App, Component, Plugin } from 'vue'

const withInstall = <T extends Component>(component: T) => {
  const _component = component as T & Plugin

  if (!_component.install) {
    _component.install = (app: App) => {
      app.component(component.name as string, _component)
    }
  }

  return component
}

export default withInstall
