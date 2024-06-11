import styles from './Button.module.css'
import { defineComponent, reactive, ref } from 'vue'

const Button = defineComponent({
  name: 'Button',

  setup() {
    const state = reactive({
      age: 18
    })

    const name = ref<number>(1)

    const handler = () => {
      state.age += 1
      name.value += 1
    }

    return () => (
      <div class="w-[20px] overflow-hidden text-ellipsis whitespace-nowrap">123</div>
    )
  }
})

export default Button
