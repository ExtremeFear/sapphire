import '@/styles/main.css'
import Button from './Button'

Button.install = (app: any) => {
  app.use('Button', Button)
}

export default Button
