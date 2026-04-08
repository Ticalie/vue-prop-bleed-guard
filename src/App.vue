<template>
  <main class="container">
    <h1>Props / attrs bleeding POC</h1>
    <p class="intro">
      This demo shows how undeclared attrs and listeners can "bleed" into child components in Vue,
      and how to progressively lock things down.
    </p>

    <section class="card">
      <h2>Compiler setting: strict template checks</h2>
      <p>
        Enable this in your TS config so Vue templates are type-checked like TypeScript, and bad
        props/events show up as IntelliSense errors instead of only runtime surprises.
      </p>
      <pre>{{ `"vueCompilerOptions": { "strictTemplates": true }` }}</pre>
      <p>Why it helps in this POC:</p>
      <ul>
        <li>Flags unsupported listeners/attrs (for example, `@click` on `TotallyPropGuard`).</li>
        <li>Makes the `defineProps` / `defineEmits` contract visible directly in the template.</li>
        <li>Combines with runtime guards like `useStrictAttrs` so you get editor + runtime safety.</li>
      </ul>
    </section>

    <section class="card">
      <h2>1) Default behavior (bleeds)</h2>
      <p>
        `PropBleed` does not disable inherited attrs, so the parent `@click` is forwarded to the
        internal button.
      </p>
      <pre>{{ `<PropBleed @click="sayBleed" />` }}</pre>
      <PropBleed v-bind="bleedClickAttrs"></PropBleed>
      <small>Try clicking: parent handler fires ("I bleed").</small>
    </section>

    <section class="card">
      <h2>2) inheritAttrs: false (no bleed)</h2>
      <p>
        `NoPropBleed` sets `inheritAttrs: false`, so the same `@click` listener is not attached
        automatically.
      </p>
      <pre>{{ `<NoPropBleed @click="sayBleed" />` }}</pre>
      <NoPropBleed v-bind="bleedClickAttrs"></NoPropBleed>
      <small>Try clicking: no parent click listener is triggered.</small>
    </section>

    <section class="card">
      <h2>3) Strict attrs + typed emits (guarded)</h2>
      <p>
        `TotallyPropGuard` validates unexpected attrs and only exposes an explicit `say-hi` event.
        This catches accidental listeners earlier (including TS feedback in usage).
      </p>
      <pre>{{ `<TotallyPropGuard label="Wat" @say-hi="sayHi" />` }}</pre>
      <TotallyPropGuard label="Say hi" @say-hi="sayHi"></TotallyPropGuard>
      <button class="toggle-btn" type="button" @click="showGuardError = !showGuardError">
        {{ showGuardError ? 'Hide' : 'Show' }} invalid attrs example
      </button>
      <pre>{{ `<TotallyPropGuard label="Wat" @click="sayBleed" />` }}</pre>
      <TotallyPropGuard v-if="showGuardError" label="This one should error" v-bind="guardErrorAttrs"></TotallyPropGuard>
      <small>
        Expected: only `@say-hi` is part of the public contract. Toggle the invalid example, then
       <strong>check the browser console</strong> for the guard error.
      </small>
    </section>
  </main>
</template>

<script setup lang="ts">
import NoPropBleed from './components/NoPropBleed.vue'
import PropBleed from './components/PropBleed.vue'
import TotallyPropGuard from './components/TotallyPropGuard.vue'
import { ref } from 'vue'

const showGuardError = ref(false)

const sayHi = (): void => {
  alert('Hi')
}

const sayBleed = (): void => {
  alert('I bleed')
}

const bleedClickAttrs = { onClick: sayBleed };
const guardErrorAttrs = { onClick: sayBleed };
</script>

<style scoped>
.container {
  max-width: 880px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
}

.intro {
  margin: 0.75rem 0 1.5rem;
  line-height: 1.5;
}

.card {
  padding: 1rem 1rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid #dcdcdc;
  border-radius: 10px;
  background: #fafafa;
}

h1,
h2 {
  margin-top: 0;
}

pre {
  padding: 0.6rem 0.75rem;
  overflow-x: auto;
  border-radius: 6px;
  background: #1f2937;
  color: #f9fafb;
}

small {
  display: block;
  margin-top: 0.6rem;
  color: #555;
}

.toggle-btn {
  margin-top: 0.75rem;
}

ul {
  margin: 0.5rem 0 0;
  padding-left: 1.2rem;
}

li + li {
  margin-top: 0.3rem;
}
</style>
