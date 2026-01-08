import type { Access } from 'payload'

type UserWithRole = {
  role?: string
  id: number
}

export const adminsOrManagersAndUser: Access = ({ req: { user } }) => {
  // Need to be logged in
  if (user) {
    const role = (user as UserWithRole).role
    // If user has role of 'admin' or 'manager', they have full access
    if (role === 'admin' || role === 'manager') {
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
