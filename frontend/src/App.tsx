import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { BottomNavigation, BottomNavigationAction, Box, Paper } from '@mui/material'
import { useMemo, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './auth/AuthContext'
import { loadFavorites, saveFavorites } from './state/persist'
import type { ShoeCardModel } from './components/ShoeCard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { FavoritesPage } from './pages/FavoritesPage'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'

function AppShell() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const [favorites, setFavorites] = useState<ShoeCardModel[]>(() => loadFavorites())
  const [uploadedShoes, setUploadedShoes] = useState<ShoeCardModel[]>([])

  const tab = useMemo(() => {
    if (location.pathname.startsWith('/favorites')) return 'favorites'
    if (location.pathname.startsWith('/profile')) return 'profile'
    return 'home'
  }, [location.pathname])

  const showNav = !location.pathname.startsWith('/login')

  function toggleFavorite(shoe: ShoeCardModel) {
    setFavorites((prev) => {
      const key = `${shoe.brand}-${shoe.model}-${shoe.size}`
      const exists = prev.some((s) => `${s.brand}-${s.model}-${s.size}` === key)
      const next = exists ? prev.filter((s) => `${s.brand}-${s.model}-${s.size}` !== key) : [...prev, shoe]
      saveFavorites(next)
      return next
    })
  }

  function ensureFavorite(shoe: ShoeCardModel) {
    setFavorites((prev) => {
      const key = `${shoe.brand}-${shoe.model}-${shoe.size}`
      const exists = prev.some((s) => `${s.brand}-${s.model}-${s.size}` === key)
      const next = exists ? prev : [...prev, shoe]
      saveFavorites(next)
      return next
    })
  }

  function isFavorite(shoe: ShoeCardModel) {
    const key = `${shoe.brand}-${shoe.model}-${shoe.size}`
    return favorites.some((s) => `${s.brand}-${s.model}-${s.size}` === key)
  }

  function addUploadedShoe(shoe: ShoeCardModel) {
    setUploadedShoes((prev) => {
      const key = `${shoe.brand}-${shoe.model}-${shoe.size}`
      const exists = prev.some((s) => `${s.brand}-${s.model}-${s.size}` === key)
      return exists ? prev : [shoe, ...prev]
    })
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <HomePage
                onOpenProfile={() => navigate('/profile')}
                onToggleFavorite={toggleFavorite}
                onEnsureFavorite={ensureFavorite}
                uploadedShoes={uploadedShoes}
                onUploadedShoe={addUploadedShoe}
                isFavorite={isFavorite}
              />
            }
          />
          <Route
            path="/favorites"
            element={<FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite} />}
          />
          <Route path="/profile" element={<ProfilePage onReset={() => navigate('/')} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {showNav ? (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
          }}
        >
          <BottomNavigation
            showLabels
            value={tab}
            onChange={(_, v: string) => {
              if (v === 'home') navigate('/')
              if (v === 'favorites') navigate('/favorites')
              if (v === 'profile') navigate('/profile')
            }}
          >
            <BottomNavigationAction label={t('app.home')} value="home" icon={<HomeOutlinedIcon />} />
            <BottomNavigationAction
              label={t('app.favorites')}
              value="favorites"
              icon={<FavoriteBorderIcon />}
            />
            <BottomNavigationAction label={t('app.profile')} value="profile" icon={<PersonOutlineIcon />} />
          </BottomNavigation>
        </Paper>
      ) : null}
    </Box>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  )
}

export default App
