import FavoriteIcon from '@mui/icons-material/Favorite'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ShoeCard, type ShoeCardModel } from '../components/ShoeCard'
import { rankSuggestionsByPain } from '../mock/socialSuggestions'
import { loadUserProfile } from '../state/persist'

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
  const profile = useMemo(() => loadUserProfile(), [])
  const selectedPain = selectedShoe?.blurb?.trim() || profile.pain || ''
  const suggestions = useMemo(() => rankSuggestionsByPain(selectedPain), [selectedPain])

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

