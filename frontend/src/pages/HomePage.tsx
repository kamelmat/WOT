import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined'
import AddIcon from '@mui/icons-material/Add'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Fab,
  IconButton,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { fitApi } from '../api/client'
import { resolveApiUrl } from '../api/resolveApiUrl'
import type { Recommendation } from '../api/types'
import { AddShoeDialog } from '../components/AddShoeDialog'
import { ShoeCard, type ShoeCardModel } from '../components/ShoeCard'
import { matchImage } from '../mock/imageMatch'
import { mockRecommendations } from '../mock/recommendations'
import { clearFitProfileId, loadFitProfileId, loadUserProfile, saveFitProfileId } from '../state/persist'

function toCard(r: Recommendation, idx: number): ShoeCardModel {
  const label = r.fitLabel.toLowerCase()
  const blurbKey = label.includes('perfect')
    ? 'shoeCard.blurbPerfect'
    : label.includes('loose')
      ? 'shoeCard.blurbLoose'
      : 'shoeCard.blurbTight'
  return {
    brand: r.brand,
    model: r.model,
    size: r.size,
    fitScore: r.fitScore,
    fitLabel: r.fitLabel,
    blurb: blurbKey,
    buyUrl: undefined,
    imageUrl: resolveApiUrl(r.imageUrl) ?? matchImage(r.brand, r.model),
    imageVariant: idx % 2 === 0 ? 'left' : 'right',
  }
}

export function HomePage({
  onOpenProfile,
  onToggleFavorite,
  onEnsureFavorite,
  uploadedShoes,
  onUploadedShoe,
  isFavorite,
}: {
  onOpenProfile: () => void
  onToggleFavorite: (shoe: ShoeCardModel) => void
  onEnsureFavorite: (shoe: ShoeCardModel) => void
  uploadedShoes: ShoeCardModel[]
  onUploadedShoe: (shoe: ShoeCardModel) => void
  isFavorite: (shoe: ShoeCardModel) => boolean
}) {
  const { t } = useTranslation()
  const [fitProfileId, setFitProfileId] = useState<string | null>(() => loadFitProfileId())
  const [openAddShoe, setOpenAddShoe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recs, setRecs] = useState<ShoeCardModel[]>(() => mockRecommendations)
  const [confidence, setConfidence] = useState<number | null>(null)

  const profile = useMemo(() => loadUserProfile(), [fitProfileId])
  const greetingName = profile.name
  const idealFit = useMemo(() => {
    return { lengthCm: profile.lengthCm, widthMm: profile.widthMm }
  }, [profile.lengthCm, profile.widthMm])

  async function refresh(currentId: string) {
    setLoading(true)
    setError(null)
    try {
      const validated = await fitApi.validate({ fitProfileId: currentId })
      const r = await fitApi.recommendations(currentId)
      setConfidence(validated.confidence ?? r.confidence)
      const fromApi = r.recommendations.map((x, idx) => toCard(x, idx))
      const merged = [...uploadedShoes, ...fromApi].filter((shoe, idx, arr) => {
        const key = `${shoe.brand}-${shoe.model}-${shoe.size}`
        return arr.findIndex((s) => `${s.brand}-${s.model}-${s.size}` === key) === idx
      })
      setRecs(merged)
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unable to load recommendations'
      if (message.includes('FIT_PROFILE_NOT_FOUND')) {
        clearFitProfileId()
        setFitProfileId(null)
        setRecs(mockRecommendations)
        setConfidence(0.65)
        setError('Your previous fit profile is no longer available. Add a shoe to create a new one.')
        return
      }
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (fitProfileId) return
    void fitApi.myProfile().then((summary) => {
      if (summary.fitProfileId) {
        saveFitProfileId(summary.fitProfileId)
        setFitProfileId(summary.fitProfileId)
      }
    }).catch(() => {
      // no profile yet
    })
  }, [fitProfileId])

  useEffect(() => {
    if (!fitProfileId) return
    void refresh(fitProfileId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fitProfileId, uploadedShoes])

  useEffect(() => {
    if (fitProfileId) return
    setRecs(mockRecommendations)
    setConfidence(0.65)
  }, [fitProfileId])

  return (
    <>
      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 800 }}>
            {t('app.title')}
          </Typography>
          <IconButton onClick={onOpenProfile} aria-label="Profile">
            <PersonOutlineIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          background:
            'radial-gradient(1000px 420px at 50% -80px, rgba(37,99,235,0.12), transparent 60%), radial-gradient(900px 380px at 20% -120px, rgba(15,23,42,0.08), transparent 55%)',
        }}
      >
        <Container maxWidth="sm" sx={{ pb: 10 }}>
          <Stack spacing={2.5} sx={{ pt: 1.5 }}>
          <Box>
            <Typography variant="h5" fontWeight={900} sx={{ letterSpacing: -0.4 }}>
              {t('home.hi', { name: greetingName })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('home.idealFit', { lengthCm: idealFit.lengthCm, widthMm: idealFit.widthMm })}
            </Typography>
          </Box>

          <Paper variant="outlined" sx={{ p: 1 }}>
            <Button
              fullWidth
              startIcon={<FilterAltOutlinedIcon />}
              onClick={() => {
                // UI placeholder: backend doesn't yet accept filters.
                setError(t('home.widthFiltersMvpNote'))
              }}
              sx={{ justifyContent: 'flex-start', py: 1.25 }}
            >
              {t('home.adjustWidthFilters')}
            </Button>
          </Paper>

          {!fitProfileId ? (
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle1" fontWeight={800}>
                  {t('home.addShoeToStartTitle')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('home.addShoeToStartBody')}
                </Typography>
                <Button variant="contained" onClick={() => setOpenAddShoe(true)}>
                  {t('home.addShoe')}
                </Button>
              </Stack>
            </Paper>
          ) : null}

          {error ? <Alert severity="info">{error}</Alert> : null}

          <Stack direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'grey.100' }} />
            <Typography variant="h6" fontWeight={900}>
              {t('home.recommendedShoes')}
            </Typography>
          </Stack>

          {confidence != null ? (
            <Typography variant="body2" color="text.secondary">
              {confidence == null ? '—' : t('home.confidence', { pct: Math.round(confidence * 100) })}
            </Typography>
          ) : null}

          <Stack spacing={2}>
            {recs.map((shoe) => (
              <ShoeCard
                key={`${shoe.brand}-${shoe.model}-${shoe.size}`}
                shoe={{ ...shoe, blurb: shoe.blurb ? t(shoe.blurb) : undefined }}
                isFavorite={isFavorite(shoe)}
                onToggleFavorite={() => onToggleFavorite(shoe)}
              />
            ))}
            {fitProfileId && !loading && recs.length === 0 ? (
              <Typography color="text.secondary">{t('home.noRecommendations')}</Typography>
            ) : null}
          </Stack>

          <Button
            variant={fitProfileId ? 'outlined' : 'contained'}
            onClick={() => setOpenAddShoe(true)}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {fitProfileId ? t('home.addAnotherShoe') : t('home.addShoe')}
          </Button>

          {fitProfileId ? null : (
            <Button
              variant="text"
              color="inherit"
              sx={{ opacity: 0.7 }}
            >
              Más zapatillas
            </Button>
          )}
          </Stack>
        </Container>
      </Box>

      <AddShoeDialog
        open={openAddShoe}
        onClose={() => setOpenAddShoe(false)}
        onSubmit={async ({ request, imageFile }) => {
          const r = imageFile
            ? await fitApi.addShoeWithImage({ request, imageFile })
            : await fitApi.addShoe(request)

          const localImage = imageFile ? URL.createObjectURL(imageFile) : matchImage(request.brand, request.model)
          const uploadedCard: ShoeCardModel = {
            brand: request.brand,
            model: request.model,
            size: request.size,
            fitScore: request.fitFeedback === 'PERFECT' ? 99 : request.fitFeedback === 'LOOSE' ? 84 : 78,
            fitLabel: request.fitFeedback,
            blurb: request.liked ?? undefined,
            imageUrl: localImage,
            imageVariant: 'left',
          }

          onUploadedShoe(uploadedCard)
          setRecs((prev) => {
            const next = [uploadedCard, ...prev]
            return next.filter((shoe, idx, arr) => {
              const key = `${shoe.brand}-${shoe.model}-${shoe.size}`
              return arr.findIndex((s) => `${s.brand}-${s.model}-${s.size}` === key) === idx
            })
          })
          onEnsureFavorite(uploadedCard)

          saveFitProfileId(r.fitProfileId)
          setFitProfileId(r.fitProfileId)
        }}
      />

      <Fab
        color="secondary"
        aria-label={t('home.addShoe')}
        onClick={() => setOpenAddShoe(true)}
        sx={{ position: 'fixed', right: 20, bottom: 88 }}
      >
        <AddIcon />
      </Fab>
    </>
  )
}

