import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export function LoginPage() {
  const { t } = useTranslation()
  const { isAuthenticated, loading, login, register } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && isAuthenticated) {
    return <Navigate to="/" replace />
  }

  async function handleSubmit() {
    setError(null)
    setSubmitting(true)
    try {
      if (mode === 'login') {
        await login(email.trim(), password)
      } else {
        await register(email.trim(), password)
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : t('auth.genericError')
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Container maxWidth="xs">
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={800}>
              {t('app.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mode === 'login' ? t('auth.loginSubtitle') : t('auth.registerSubtitle')}
            </Typography>

            {error ? <Alert severity="error">{error}</Alert> : null}

            <TextField
              label={t('auth.email')}
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
            <TextField
              label={t('auth.password')}
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText={mode === 'register' ? t('auth.passwordHelp') : undefined}
              fullWidth
            />

            <Button
              variant="contained"
              size="large"
              disabled={submitting || !email.trim() || password.length < 8}
              onClick={() => void handleSubmit()}
            >
              {mode === 'login' ? t('auth.signIn') : t('auth.createAccount')}
            </Button>

            <Typography variant="body2" color="text.secondary" textAlign="center">
              {mode === 'login' ? t('auth.noAccount') + ' ' : t('auth.hasAccount') + ' '}
              <Link
                component="button"
                type="button"
                underline="hover"
                onClick={() => {
                  setMode(mode === 'login' ? 'register' : 'login')
                  setError(null)
                }}
              >
                {mode === 'login' ? t('auth.createAccount') : t('auth.signIn')}
              </Link>
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </Box>
  )
}
