import { describe, expect, it } from 'vitest'
import { getNextOnboardingStep, onboardingSteps } from './onboarding'

describe('onboarding flow', () => {
  it('returns the first incomplete step by default', () => {
    const next = getNextOnboardingStep(onboardingSteps)
    expect(next.id).toBe('create-project')
  })

  it('returns the last step when all are completed', () => {
    const completed = onboardingSteps.map((step) => ({ ...step, completed: true }))
    const next = getNextOnboardingStep(completed)
    expect(next.id).toBe('export-share')
  })
})
