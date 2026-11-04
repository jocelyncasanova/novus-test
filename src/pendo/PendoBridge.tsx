/**
 * PendoBridge — provider slot for Pendo install & wiring.
 *
 * The Pendo agent is loaded by the install snippet in index.html and booted
 * once (anonymously) by `pendo.initialize` in src/main.tsx. This component
 * keeps the agent's visitor/account identity in sync with the auth store:
 * whenever a visitor + workspace are available (sign-in, signup completion,
 * refresh hydration, or a Profile/Workspace settings edit) it calls
 * `pendo.identify` with the full metadata. Sign-out is handled by
 * `pendo.clearSession()` inside `authStore.signOut`.
 *
 * Its position in the App.tsx provider stack is fixed per FND-07.
 */

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuthStore } from '../auth'
import type { Session } from '../auth'
import { K, readWithSchema, SessionSchema } from '../storage'

export function PendoBridge({ children }: { children: ReactNode }) {
  const visitor = useAuthStore((s) => s.currentVisitor)
  const workspace = useAuthStore((s) => s.currentWorkspace)

  useEffect(() => {
    if (visitor === null || workspace === null) return

    const session = readWithSchema<Session | null>(K.session(), SessionSchema, null)

    pendo.identify({
      visitor: {
        id: visitor.id,
        email: visitor.email,
        full_name: `${visitor.firstName} ${visitor.lastName}`.trim(),
        firstName: visitor.firstName,
        lastName: visitor.lastName,
        username: visitor.username,
        jobTitle: visitor.jobTitle,
        role: visitor.role,
        yearsExperience: visitor.yearsExperience,
        location: visitor.location,
        primaryUseCase: visitor.primaryUseCase,
        teamSize: visitor.teamSize,
        topGoals: visitor.topGoals,
        createdAt: visitor.createdAt,
        accountId: workspace.id,
        signedInAt: session?.signedInAt,
      },
      account: {
        id: workspace.id,
        name: workspace.companyName,
        companyName: workspace.companyName,
        companySize: workspace.companySize,
        industry: workspace.industry,
        planTier: workspace.planTier,
        createdAt: workspace.createdAt,
      },
    })
  }, [visitor, workspace])

  return <>{children}</>
}
