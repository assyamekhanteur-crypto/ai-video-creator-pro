export type TeamRole = 'owner' | 'admin' | 'member'

export interface TeamMember {
  id: string
  owner_id: string
  user_id: string
  email: string
  role: TeamRole
  created_at: string
}

export interface TeamInvitation {
  id: string
  owner_id: string
  email: string
  role: TeamRole
  status: 'pending' | 'accepted' | 'declined'
  created_at: string
}

export interface ProjectShare {
  id: string
  project_id: string
  member_id: string
  role: TeamRole
  created_at: string
}

export function isTeamAdmin(role?: TeamRole) {
  return role === 'owner' || role === 'admin'
}
