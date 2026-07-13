import { describe, expect, it } from 'vitest'
import { isTeamAdmin } from './team'

describe('isTeamAdmin', () => {
  it('allows owners and admins', () => {
    expect(isTeamAdmin('owner')).toBe(true)
    expect(isTeamAdmin('admin')).toBe(true)
  })

  it('blocks members', () => {
    expect(isTeamAdmin('member')).toBe(false)
    expect(isTeamAdmin(undefined)).toBe(false)
  })
})
