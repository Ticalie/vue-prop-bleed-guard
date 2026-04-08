## poc-props-bleeding

Small Vue 3 + TypeScript POC that shows how props and listeners can “bleed” into child components, and how to lock that down with compiler options and a hybrid guard pattern.

### What it demonstrates

- **Default attr/listener fallthrough**: `PropBleed` forwards `@click` from the parent onto its internal button.
- **Stopping fallthrough**: `NoPropBleed` uses `inheritAttrs: false` to avoid accidental listeners/attrs.
- **Hybrid prop guard pattern**: `TotallyPropGuard` combines:
  - explicit contracts via `defineProps` / `defineEmits`
  - a runtime guard (`useStrictAttrs`) that rejects unknown attrs in development
  - good editor feedback when templates are type-checked

### Compiler support: strict template checks

For better IntelliSense (errors in the template, not just runtime), consumer apps can enable:

```json
{
  "vueCompilerOptions": {
    "strictTemplates": true
  }
}
```

With this on, invalid props/events (for example `@click` on `TotallyPropGuard`) are highlighted directly in the editor based on the component’s `defineProps` / `defineEmits` types.

### Running the demo

```sh
npm install
npm run dev
```
