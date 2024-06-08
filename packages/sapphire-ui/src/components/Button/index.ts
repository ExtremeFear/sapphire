import '@/styles/main.css'
import Button from './Button.vue'

Button.install = (app: any) => {
  app.use('Button', Button)
}

export default Button
