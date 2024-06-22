import { defineComponent } from 'vue'
import styles from './Card.module.css'

const SCard = defineComponent({
  name: 'SCard',

  setup() {
    return () => (
      <div class={styles.card}>
        card
        <div>123</div>
      </div>
    )
  },
})

export default SCard
