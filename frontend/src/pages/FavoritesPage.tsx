import FavoriteIcon from '@mui/icons-material/Favorite'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fitApi } from '../api/client'
import { resolveApiUrl } from '../api/resolveApiUrl'
import { ShoeCard, type ShoeCardModel } from '../components/ShoeCard'
import { matchImage } from '../mock/imageMatch'
import { loadUserProfile } from '../state/persist'

type SocialShoe = ShoeCardModel & { socialCount: number }

export function FavoritesPage({
  favorites,
  onToggleFavorite,
}: {
  favorites: ShoeCardModel[]
  onToggleFavorite: (shoe: ShoeCardModel) => void
}) {
  const { t } = useTranslation()
  const [openSuggestions, setOpenSuggestions] = useState(false)
  const [selectedShoe, setSelectedShoe] = useState<ShoeCardModel | null>(null)
  const [suggestions, setSuggestions] = useState<SocialShoe[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [suggestionsError, setSuggestionsError] = useState<string | null>(null)
  const profile = useMemo(() => loadUserProfile(), [])
  const selectedPain = useMemo(() => {
    const parts = [profile.pain, selectedShoe?.blurb].filter(Boolean)
    return parts.join(' ').trim()
  }, [profile.pain, selectedShoe?.blurb])

  useEffect(() => {
    if (!openSuggestions) return
    setLoadingSuggestions(true)
    setSuggestionsError(null)
    void fitApi
      .socialSuggestions(selectedPain)
      .then((res) => {
        setSuggestions(
          res.suggestions.map((s) => ({
            brand: s.brand,
            model: s.model,
            size: s.size,
            fitScore: s.fitScore,
            fitLabel: s.fitLabel,
            imageUrl: resolveApiUrl(s.imageUrl) ?? matchImage(s.brand, s.model),
            socialCount: s.socialCount,
          })),
        )
      })
      .catch((e) => {
        setSuggestions([])
        setSuggestionsError(e instanceof Error ? e.message : t('favorites.suggestionsError'))
      })
      .finally(() => setLoadingSuggestions(false))
  }, [openSuggestions, selectedPain, t])

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            {t('favorites.title')}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 10 }}>
        <Stack spacing={2.5} sx={{ pt: 1.5 }}>
          {favorites.length === 0 ? (
            <Stack spacing={1} alignItems="center" sx={{ mt: 4, color: 'text.secondary' }}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  bgcolor: 'grey.100',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <FavoriteIcon />
              </Box>
              <Typography>{t('favorites.empty')}</Typography>
            </Stack>
          ) : (
            favorites.map((shoe) => (
              <Stack key={`${shoe.brand}-${shoe.model}-${shoe.size}`} spacing={1}>
                <ShoeCard
                  shoe={shoe}
                  isFavorite
                  onToggleFavorite={() => onToggleFavorite(shoe)}
                  showFavoriteButton={false}
                />
                <Button variant="outlined" color="error" onClick={() => onToggleFavorite(shoe)}>
                  {t('favorites.remove')}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setSelectedShoe(shoe)
                    setOpenSuggestions(true)
                  }}
                >
                  {t('favorites.suggestionsButton')}
                </Button>
              </Stack>
            ))
          )}
        </Stack>
      </Container>

      <Dialog open={openSuggestions} onClose={() => setOpenSuggestions(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('favorites.suggestionsTitle')}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {t('favorites.suggestionsSubtitle')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('favorites.currentShoe')}: {selectedShoe ? `${selectedShoe.brand} ${selectedShoe.model}` : '-'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('favorites.currentPain')}: {selectedPain || t('favorites.noPain')}
            </Typography>

            {loadingSuggestions ? (
              <Box sx={{ display: 'grid', placeItems: 'center', py: 3 }}>
                <CircularProgress size={28} />
              </Box>
            ) : null}

            {suggestionsError ? <Alert severity="info">{suggestionsError}</Alert> : null}

            {!loadingSuggestions && !suggestionsError && suggestions.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {t('favorites.suggestionsEmpty')}
              </Typography>
            ) : null}

            {suggestions.map((shoe) => (
              <Stack key={`${shoe.brand}-${shoe.model}`} spacing={1}>
                <ShoeCard shoe={shoe} isFavorite={false} showFavoriteButton={false} />
                <Chip
                  color="primary"
                  variant="outlined"
                  label={t('favorites.socialRank', { count: shoe.socialCount })}
                />
              </Stack>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
