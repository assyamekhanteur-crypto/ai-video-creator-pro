export interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

export const onboardingSteps = [
  {
    id: 'create-project',
    title: 'Create your first project',
    description: 'Start from a prompt or one of the ready-made templates.',
    completed: false,
  },
  {
    id: 'generate-assets',
    title: 'Generate your assets',
    description: 'Script, voice, video and captions are produced in one flow.',
    completed: false,
  },
  {
    id: 'export-share',
    title: 'Export and share',
    description: 'Review the timeline, refine your edit, and publish your video.',
    completed: false,
  },
] satisfies OnboardingStep[]

export function getNextOnboardingStep(steps: OnboardingStep[]) {
  return steps.find((step) => !step.completed) ?? steps[steps.length - 1]
}
