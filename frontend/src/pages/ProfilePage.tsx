import LogoutIcon from '@mui/icons-material/Logout'
import { AppBar, Button, Container, MenuItem, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getLanguage, setLanguage } from '../i18n/i18n'
import { fitApi } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { clearFitProfileId, loadFitProfileId, loadUserProfile, saveUserProfile } from '../state/persist'
import { useMemo, useState } from 'react'

export function ProfilePage({ onReset }: { onReset: () => void }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const fitProfileId = loadFitProfileId()
  const lang = getLanguage()
  const initialProfile = useMemo(() => loadUserProfile(), [])
  const [name, setName] = useState(initialProfile.name)
  const [lengthCm, setLengthCm] = useState(initialProfile.lengthCm === '—' ? '' : initialProfile.lengthCm)
  const [widthMm, setWidthMm] = useState(initialProfile.widthMm === '—' ? '' : initialProfile.widthMm)
  const [pain, setPain] = useState(initialProfile.pain ?? '')
  const [editing, setEditing] = useState(false)

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            {t('profile.title')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 10 }}>
        <Stack spacing={2.5} sx={{ pt: 1.5 }}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle1" fontWeight={800}>
                {t('profile.yourInfo')}
              </Typography>
              <TextField
                label={t('profile.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editing}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  label={t('profile.lengthCm')}
                  value={lengthCm}
                  onChange={(e) => setLengthCm(e.target.value)}
                  inputMode="decimal"
                  disabled={!editing}
                />
                <TextField
                  fullWidth
                  label={t('profile.widthMm')}
                  value={widthMm}
                  onChange={(e) => setWidthMm(e.target.value)}
                  inputMode="numeric"
                  disabled={!editing}
                />
              </Stack>

              <TextField
                label={t('profile.painLabel')}
                value={pain}
                onChange={(e) => setPain(e.target.value)}
                placeholder={t('profile.painPlaceholder')}
                multiline
                minRows={3}
                disabled={!editing}
              />
              <Stack direction="row" spacing={1}>
                {!editing ? (
                  <Button variant="contained" onClick={() => setEditing(true)}>
                    {t('profile.edit')}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      onClick={() => {
                        const updated = {
                          name: name.trim() || 'User',
                          lengthCm: lengthCm.trim() || '—',
                          widthMm: widthMm.trim() || '—',
                          pain: pain.trim(),
                        }
                        saveUserProfile(updated)
                        if (fitProfileId) {
                          void fitApi.updateProfilePain(fitProfileId, { pain: updated.pain })
                        }
                        setEditing(false)
                      }}
                    >
                      {t('profile.save')}
                    </Button>
                    <Button variant="outlined" onClick={() => setEditing(false)}>
                      {t('profile.cancelEdit')}
                    </Button>
                  </>
                )}
              </Stack>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('profile.accountLabel')}
              </Typography>
              <Typography fontWeight={800}>{user?.email ?? '—'}</Typography>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={0.5}>
              <Typography variant="subtitle2" color="text.secondary">
                {t('profile.fitProfileIdLabel')}
              </Typography>
              <Typography fontWeight={800}>{fitProfileId ?? 'Not set'}</Typography>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle1" fontWeight={800}>
                {t('profile.language')}
              </Typography>
              <TextField
                select
                value={lang}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
              >
                <MenuItem value="en">{t('profile.english')}</MenuItem>
                <MenuItem value="es">{t('profile.spanish')}</MenuItem>
              </TextField>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle1" fontWeight={800}>
                {t('profile.signOutTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('profile.signOutBody')}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  logout()
                  navigate('/login')
                }}
              >
                {t('profile.signOut')}
              </Button>
            </Stack>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Stack spacing={1.25}>
              <Typography variant="subtitle1" fontWeight={800}>
                {t('profile.resetTitle')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('profile.resetBody')}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => {
                  clearFitProfileId()
                  onReset()
                }}
              >
                {t('profile.clearFitProfile')}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  )
}

