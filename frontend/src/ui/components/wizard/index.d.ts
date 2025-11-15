import type { Component } from 'vue'

export type WizardStep<T> = {
  key: T
  component: Component
  props?: Record<string, unknown>
}
