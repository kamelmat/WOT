import { shoeImages } from '../assets/shoes'
import type { ShoeCardModel } from '../components/ShoeCard'

type SocialSignal = {
  userPain: string
  shoe: ShoeCardModel
}

const leftBunionSignals: SocialSignal[] = [
  {
    userPain: 'Tengo juanete izquierdo y me duele al correr',
    shoe: {
      brand: 'HOKA',
      model: 'Clifton 9',
      size: 'EU 42',
      fitScore: 94,
      fitLabel: 'Calce Perfecto',
      blurb: 'Muchos usuarios con juanete izquierdo la eligen.',
      imageUrl: shoeImages.hokaClifton9,
    },
  },
  {
    userPain: 'juanete izquierdo, pie ancho',
    shoe: {
      brand: 'Nike',
      model: 'AVA Rover',
      size: 'EU 42',
      fitScore: 91,
      fitLabel: 'Calce Perfecto',
      blurb: 'Buena para pies anchos con molestias laterales.',
      imageUrl: shoeImages.nikeAvaRover,
    },
  },
  {
    userPain: 'dolor por juanete izquierdo y uso de plantillas',
    shoe: {
      brand: 'Nike',
      model: 'Air Force 1 07',
      size: 'EU 42',
      fitScore: 88,
      fitLabel: 'Levemente Holgado',
      blurb: 'Muchos usuarios con juanete izquierdo la usan para diario.',
      imageUrl: shoeImages.nikeAirForce1,
    },
  },
  {
    userPain: 'juanete izquierdo y pie ancho',
    shoe: {
      brand: 'Nike',
      model: 'Air Zoom',
      size: 'EU 42',
      fitScore: 86,
      fitLabel: 'Levemente Holgado',
      blurb: 'Más espacio en antepié para molestias laterales.',
      imageUrl: shoeImages.nikeAirZoom,
    },
  },
  {
    userPain: 'me duele el arco derecho',
    shoe: {
      brand: 'DC',
      model: 'Court Graffik',
      size: 'EU 42',
      fitScore: 80,
      fitLabel: 'Levemente Holgado',
      blurb: 'Popular para uso diario con base estable.',
      imageUrl: shoeImages.dcShoe,
    },
  },
]

const rightWideSignals: SocialSignal[] = [
  {
    userPain: 'pie derecho muy ancho al correr',
    shoe: {
      brand: 'Nike',
      model: 'Vomero 18',
      size: 'EU 42',
      fitScore: 93,
      fitLabel: 'Calce Perfecto',
      blurb: 'Muy elegida por usuarios con pie derecho ancho.',
      imageUrl: shoeImages.nikeVomero18,
    },
  },
  {
    userPain: 'derecho ancho, necesito mas espacio',
    shoe: {
      brand: 'Nike',
      model: 'Air Zoom',
      size: 'EU 42',
      fitScore: 89,
      fitLabel: 'Levemente Holgado',
      blurb: 'Da más volumen en antepié.',
      imageUrl: shoeImages.nikeAirZoom,
    },
  },
  {
    userPain: 'pie derecho ancho y molestias laterales',
    shoe: {
      brand: 'Nike',
      model: 'Air Force 1 07',
      size: 'EU 42',
      fitScore: 85,
      fitLabel: 'Levemente Holgado',
      blurb: 'Buena opción urbana para pie ancho.',
      imageUrl: shoeImages.nikeAirForce1,
    },
  },
  {
    userPain: 'pie derecho demasiado ancho',
    shoe: {
      brand: 'DC',
      model: 'Court Graffik',
      size: 'EU 42',
      fitScore: 82,
      fitLabel: 'Levemente Holgado',
      blurb: 'Ancha y estable para uso diario.',
      imageUrl: shoeImages.dcShoe,
    },
  },
]

function normalizeTokens(input: string): string[] {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 3)
}

function signalsForPain(userPain: string): SocialSignal[] {
  const normalized = normalizeTokens(userPain).join(' ')
  const hasLeftBunion = normalized.includes('juanete') && normalized.includes('izquierd')
  const hasRightWide = normalized.includes('derech') && normalized.includes('ancho')

  if (hasLeftBunion) return leftBunionSignals
  if (hasRightWide) return rightWideSignals
  return [...leftBunionSignals, ...rightWideSignals]
}

export function rankSuggestionsByPain(userPain: string): Array<ShoeCardModel & { socialCount: number }> {
  const activeSignals = signalsForPain(userPain)
  const painTokens = new Set(normalizeTokens(userPain))
  const counts = new Map<string, { shoe: ShoeCardModel; score: number }>()

  for (const signal of activeSignals) {
    const signalTokens = normalizeTokens(signal.userPain)
    let overlap = 0
    for (const token of signalTokens) {
      if (painTokens.has(token)) overlap += 1
    }
    if (overlap === 0) continue

    const key = `${signal.shoe.brand}-${signal.shoe.model}`
    const current = counts.get(key)
    if (!current) {
      counts.set(key, { shoe: signal.shoe, score: overlap })
    } else {
      current.score += overlap
    }
  }

  const ranked = [...counts.values()]
    .sort((a, b) => b.score - a.score)
    .map((x) => ({ ...x.shoe, socialCount: x.score }))

  // fallback list for empty or unknown pain descriptions
  if (ranked.length === 0) {
    return activeSignals.slice(0, 3).map((s, idx) => ({
      ...s.shoe,
      socialCount: 3 - idx,
    }))
  }

  return ranked
}

