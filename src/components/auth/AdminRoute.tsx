import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

interface AdminRouteProps {
  children: React.ReactNode
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="agenda-page">
        <p className="agenda-status" style={{ padding: '4rem', textAlign: 'center' }}>[LOADING...]</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/agenda" replace />
  }

  return <>{children}</>
}
