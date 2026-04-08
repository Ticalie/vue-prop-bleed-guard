import { useAttrs, watchEffect } from 'vue'

type StrictAttrsOptions = {
  componentName: string
  allowed?: readonly string[]
  mode?: 'warn' | 'error'
}

const formatKey = (key: string): string => {
  if (key.startsWith('on') && key.length > 2) {
    return `@${key.slice(2)}`
  }
  return key
}

export const useStrictAttrs = ({
  componentName,
  allowed = [],
  mode = 'error',
}: StrictAttrsOptions): void => {
  const attrs = useAttrs()
  const allowedSet = new Set(allowed)

  watchEffect(() => {
    if (import.meta.env.PROD) return

    const unknown = Object.keys(attrs).filter((key) => !allowedSet.has(key))
    if (unknown.length === 0) return

    const details = unknown.map(formatKey).join(', ')
    const message = `[${componentName}] Unknown prop/listener received: ${details}
Have TypeScript help you. Add "vueCompilerOptions": { "strictTemplates": true } to your tsconfig.json to get better errors.`

    if (mode === 'warn') {
      console.warn(message)
      return
    }

    throw new Error(message)
  })
}
