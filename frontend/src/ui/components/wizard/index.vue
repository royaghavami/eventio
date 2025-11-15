<script setup lang="ts" generic="T">
import TransitionSlide from '@/ui/components/transition/index.vue'

import type { WizardStep } from '.'

defineOptions({
  name: 'Wizard'
})

const props = defineProps<{
  activeStep: T
  steps: WizardStep<T>[]
}>()

const currentStep = computed(() => {
  const activeIndex = props.steps.findIndex(
    ({ key }) => key === props.activeStep
  )

  return {
    index: activeIndex,
    data: props.steps[activeIndex] as WizardStep<T>
  }
})
</script>

<template>
  <TransitionSlide :slide="currentStep.index">
    <div
      :key="`${currentStep.data.key}`"
      data-wizard-wrapper
    >
      <Suspense>
        <Component
          :is="currentStep.data.component"
          v-bind="currentStep.data.props"
        />
      </Suspense>
    </div>
  </TransitionSlide>
</template>
