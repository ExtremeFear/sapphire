import type { App, Component, DefineComponent } from 'vue'

export type WithInstallComponent = (Component | DefineComponent) & {
  install?: (app: App) => void
}

const withInstall = (component: WithInstallComponent) => {
  if (!component.install) {
    component.install = app => {
      app.component(component.name as string, component)
    }
  }

  return component
}

export default withInstall
