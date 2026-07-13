import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail, Plus, ShieldCheck, Sparkles, Trash2, CheckCircle2, Loader2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { isTeamAdmin, type TeamInvitation, type TeamMember } from '../lib/team'

export default function Team() {
  const { user, profile } = useAuth()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [ownedInvitations, setOwnedInvitations] = useState<TeamInvitation[]>([])
  const [receivedInvitations, setReceivedInvitations] = useState<TeamInvitation[]>([])
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [responseLoadingId, setResponseLoadingId] = useState<string | null>(null)
  const role = profile?.role ?? (profile?.is_admin ? 'admin' : 'member')

  const canManage = isTeamAdmin(role as any)

  useEffect(() => {
    if (!user) return
    let mounted = true

    const load = async () => {
      const [membersResult, ownedInvitesResult, receivedInvitesResult] = await Promise.all([
        supabase.from('team_members').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
        supabase.from('team_invitations').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
        supabase.from('team_invitations').select('*').eq('email', user.email ?? '').order('created_at', { ascending: false }),
      ])

      if (!mounted) return
      setMembers((membersResult.data ?? []) as TeamMember[])
      setOwnedInvitations((ownedInvitesResult.data ?? []) as TeamInvitation[])
      setReceivedInvitations((receivedInvitesResult.data ?? []) as TeamInvitation[])
      setLoading(false)
    }

    load()
    return () => { mounted = false }
  }, [user])

  const handleInvite = async () => {
    if (!user || !email.trim()) return
    setSaving(true)
    const { error } = await supabase.from('team_invitations').insert({
      owner_id: user.id,
      email: email.trim().toLowerCase(),
      role: 'member',
      status: 'pending',
    })
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setEmail('')
    toast.success('Invitation sent')
    const { data } = await supabase.from('team_invitations').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
    setOwnedInvitations((data ?? []) as TeamInvitation[])
  }

  const handleRemoveInvitation = async (id: string) => {
    const { error } = await supabase.from('team_invitations').delete().eq('id', id)
    if (error) {
      toast.error(error.message)
      return
    }
    setOwnedInvitations(prev => prev.filter(inv => inv.id !== id))
    toast.success('Invitation removed')
  }

  const handleRespondInvitation = async (invitation: TeamInvitation, accept: boolean) => {
    if (!user) return
    setResponseLoadingId(invitation.id)

    const updates = await supabase.from('team_invitations').update({ status: accept ? 'accepted' : 'declined' }).eq('id', invitation.id)
    if (updates.error) {
      setResponseLoadingId(null)
      toast.error('Could not update invitation status')
      return
    }

    if (accept) {
      const { error } = await supabase.from('team_members').insert({
        owner_id: invitation.owner_id,
        user_id: user.id,
        email: user.email ?? invitation.email,
        role: invitation.role,
      })
      if (error) {
        setResponseLoadingId(null)
        toast.error('Could not join team')
        return
      }
      toast.success('Invitation accepted')
    } else {
      toast.success('Invitation declined')
    }

    const [ownedResult, receivedResult] = await Promise.all([
      supabase.from('team_invitations').select('*').eq('owner_id', user.id).order('created_at', { ascending: false }),
      supabase.from('team_invitations').select('*').eq('email', user.email ?? '').order('created_at', { ascending: false }),
    ])

    setOwnedInvitations((ownedResult.data ?? []) as TeamInvitation[])
    setReceivedInvitations((receivedResult.data ?? []) as TeamInvitation[])
    setResponseLoadingId(null)
  }

  const cards = useMemo(() => [
    { label: 'Active members', value: members.length, icon: Users },
    { label: 'Outgoing invites', value: ownedInvitations.filter(i => i.status === 'pending').length, icon: Mail },
    { label: 'My pending invites', value: receivedInvitations.filter(i => i.status === 'pending').length, icon: Mail },
  ], [members.length, ownedInvitations, receivedInvitations])

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Team workspace</h1>
            <p className="text-slate-400 mt-2 text-sm">Invite collaborators and manage shared access to your workspace.</p>
          </div>
          {canManage && (
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> You can manage team access</div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {cards.map(card => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">{card.label}</p>
                  <p className="text-3xl font-semibold text-white mt-1">{card.value}</p>
                </div>
                <div className="rounded-xl bg-cyan-500/10 p-3 text-cyan-400">
                  <card.icon className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {canManage ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-xl bg-violet-500/10 p-2 text-violet-400"><Plus className="w-4 h-4" /></div>
              <div>
                <h2 className="font-semibold text-white">Invite collaborator</h2>
                <p className="text-sm text-slate-400">Send a simple invitation by email. The member will join the workspace and gain access to shared projects.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white placeholder:text-slate-500"
              />
              <button onClick={handleInvite} disabled={saving} className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send invite'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-sm text-slate-400">
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" /> You currently have read-only access to the workspace.</div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="font-semibold text-white mb-4">Members</h2>
            {loading ? <div className="text-sm text-slate-500">Loading…</div> : members.length === 0 ? <div className="text-sm text-slate-500">No members yet.</div> : <div className="space-y-3">{members.map(member => (
              <div key={member.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">{member.email}</p>
                  <p className="text-xs uppercase tracking-wide text-slate-500">{member.role}</p>
                </div>
                <div className="flex items-center gap-2 text-cyan-400"><CheckCircle2 className="w-4 h-4" /> Active</div>
              </div>
            ))}</div>}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="font-semibold text-white mb-4">Outgoing invitations</h2>
            {ownedInvitations.length === 0 ? (
              <div className="text-sm text-slate-500">No outgoing invites.</div>
            ) : (
              <div className="space-y-3">
                {ownedInvitations.map(inv => (
                  <div key={inv.id} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{inv.email}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{inv.status} · {inv.role}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveInvitation(inv.id)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="font-semibold text-white mb-4">Incoming invitations</h2>
            {receivedInvitations.length === 0 ? (
              <div className="text-sm text-slate-500">No incoming invitations.</div>
            ) : (
              <div className="space-y-3">
                {receivedInvitations.map(inv => (
                  <div key={inv.id} className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{inv.email}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">{inv.status} · {inv.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRespondInvitation(inv, true)}
                        disabled={responseLoadingId === inv.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleRespondInvitation(inv, false)}
                        disabled={responseLoadingId === inv.id}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/15 disabled:opacity-50"
                      >
                        <X className="w-4 h-4" /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
