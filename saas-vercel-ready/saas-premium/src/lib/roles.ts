export type AccountRole = 'owner' | 'admin' | 'member'

export function getAccountRole(profile: { is_admin?: boolean } | null | undefined): AccountRole {
  if (profile?.is_admin) return 'admin'
  return 'member'
}

export function canManageTeam(profile: { is_admin?: boolean } | null | undefined) {
  return getAccountRole(profile) === 'admin'
}
