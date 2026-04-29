/* eslint react-refresh/only-export-components: "off" */
import React from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.js'

const AuthContext = React.createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = React.useMemo(() => ({ user, loading }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

export { AuthProvider, useAuth }

