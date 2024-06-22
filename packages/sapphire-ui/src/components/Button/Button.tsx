import SCard from '@/components/Card'
import styles from './Button.module.css'
import { defineComponent, reactive, ref } from 'vue'

const SButton = defineComponent({
  name: 'SButton',

  setup() {
    const state = reactive({
      age: 18,
    })

    const name = ref(1)

    const handler = () => {
      state.age += 1
      name.value += 12
    }

    return () => (
      <button onClick={handler} class={styles.button}>
        button
        <SCard />
      </button>
    )
  },
})

export default SButton
