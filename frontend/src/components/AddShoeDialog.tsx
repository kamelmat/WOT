import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { AddShoeRequest, FitFeedback } from '../api/types'

const FEEDBACK: FitFeedback[] = ['TIGHT', 'PERFECT', 'LOOSE']

export function AddShoeDialog({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (payload: { request: AddShoeRequest; imageFile: File | null }) => Promise<void> | void
}) {
  const { t } = useTranslation()
  const [brand, setBrand] = useState('Nike')
  const [model, setModel] = useState('Pegasus 40')
  const [size, setSize] = useState('EU 42')
  const [fitFeedback, setFitFeedback] = useState<FitFeedback>('PERFECT')
  const [liked, setLiked] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const canSubmit = useMemo(() => {
    return brand.trim() && model.trim() && size.trim() && fitFeedback
  }, [brand, model, size, fitFeedback])

  async function handleSubmit() {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      await onSubmit({
        request: {
          brand: brand.trim(),
          model: model.trim(),
          size: size.trim(),
          fitFeedback,
          liked: liked.trim() || undefined,
        },
        imageFile,
      })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('addShoeDialog.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('addShoeDialog.brand')}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <TextField
              fullWidth
              label={t('addShoeDialog.model')}
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label={t('addShoeDialog.size')}
              value={size}
              onChange={(e) => setSize(e.target.value)}
              helperText={t('addShoeDialog.sizeHelp')}
            />
            <TextField
              fullWidth
              select
              label={t('addShoeDialog.fitFeedback')}
              value={fitFeedback}
              onChange={(e) => setFitFeedback(e.target.value as FitFeedback)}
            >
              {FEEDBACK.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <TextField
            label={t('addShoeDialog.liked')}
            value={liked}
            onChange={(e) => setLiked(e.target.value)}
            multiline
            minRows={3}
          />

          <Button variant="outlined" component="label">
            {t('addShoeDialog.uploadPhoto')}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0]
                setImageFile(f ?? null)
              }}
            />
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('addShoeDialog.cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!canSubmit || submitting}>
          {t('addShoeDialog.saveContinue')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

