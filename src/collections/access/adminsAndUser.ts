import type { Access } from 'payload'

type UserWithRoles = {
  roles?: string[]
  id: number
}

export const adminsAndUser: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    // If user has role of 'admin'
    const roles = (user as UserWithRoles).roles
    if (roles?.includes('admin')) {
      return true
    }

    // If any other type of user, only provide access to themselves
    return {
      id: {
        equals: user.id,
      },
    }
  }

  // Reject everyone else
  return false
}
