<template>
  <button @click="emit('sayHi')">Click me {{ props.label }}</button>
</template>

<script setup lang="ts">
import { useStrictAttrs } from '@/composables/useStrictAttrs'

// Define emits
type Emits = {
  (e: 'sayHi'): void
}



// Use defineEmits
const emit = defineEmits<Emits>()

const props = defineProps<{ label: string }>()

useStrictAttrs({
  componentName: 'TotallyPropGuard',
})
</script>
