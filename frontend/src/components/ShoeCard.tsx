import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined'
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import wireframeImg from '../assets/mock/wireframe.png'

export type ShoeCardModel = {
  brand: string
  model: string
  size: string
  fitScore: number
  fitLabel: string
  blurb?: string
  buyUrl?: string
  imageUrl?: string
  imageVariant?: 'left' | 'right'
}

function labelColor(label: string): 'success' | 'warning' | 'error' | 'default' {
  const l = label.toLowerCase()
  if (l.includes('perfect')) return 'success'
  if (l.includes('loose')) return 'warning'
  if (l.includes('tight')) return 'error'
  return 'default'
}

function variantStyles(v?: 'left' | 'right') {
  // Crop from the provided wireframe image to show the sneaker sketches.
  // This is intentionally approximate and can be replaced with real images later.
  if (v === 'right') {
    return { objectPosition: '70% 62%' as const }
  }
  return { objectPosition: '30% 62%' as const }
}

export function ShoeCard({ shoe, onToggleFavorite, isFavorite, showFavoriteButton = true }: {
  shoe: ShoeCardModel
  isFavorite: boolean
  onToggleFavorite?: () => void
  showFavoriteButton?: boolean
}) {
  const { t } = useTranslation()
  return (
    <Card
      variant="outlined"
      sx={{
        minHeight: 360,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 10px 24px rgba(15, 23, 42, 0.06)',
        borderColor: 'rgba(15,23,42,0.08)',
      }}
    >
      <CardContent sx={{ flex: '1 1 auto' }}>
        <Box
          sx={{
            height: 160,
            borderRadius: 3,
            bgcolor: '#f2f4f8',
            mb: 1.5,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={shoe.imageUrl ?? wireframeImg}
            alt=""
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: shoe.imageUrl ? 'none' : 'grayscale(1) contrast(1.05)',
              opacity: shoe.imageUrl ? 1 : 0.9,
              ...variantStyles(shoe.imageVariant),
            }}
          />
        </Box>

        <Stack spacing={0.5}>
          <Typography variant="subtitle1" fontWeight={900} sx={{ letterSpacing: -0.2 }}>
            {shoe.brand} — {shoe.model}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('shoeCard.size', { size: shoe.size })}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5, flexWrap: 'wrap' }}>
          <Chip
            size="small"
            color={labelColor(shoe.fitLabel)}
            label={shoe.fitLabel}
            variant="filled"
          />
          <Chip size="small" variant="outlined" label={t('shoeCard.fitScore', { score: shoe.fitScore })} />
        </Stack>

        {shoe.blurb ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            “{shoe.blurb}”
          </Typography>
        ) : null}

        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="secondary"
            component="a"
            href={shoe.buyUrl ?? '#'}
            target={shoe.buyUrl ? '_blank' : undefined}
            rel={shoe.buyUrl ? 'noreferrer' : undefined}
            disabled={!shoe.buyUrl}
            startIcon={<ShoppingBagOutlinedIcon />}
          >
            {t('shoeCard.buy')}
          </Button>
          {showFavoriteButton ? (
            <Button
              fullWidth
              variant={isFavorite ? 'contained' : 'outlined'}
              onClick={onToggleFavorite}
            >
              {isFavorite ? t('shoeCard.saved') : t('shoeCard.save')}
            </Button>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  )
}

