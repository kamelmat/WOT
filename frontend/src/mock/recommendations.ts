import type { ShoeCardModel } from '../components/ShoeCard'
import { shoeImages } from '../assets/shoes'

export const mockRecommendations: ShoeCardModel[] = [
  {
    brand: 'Nike',
    model: 'AVA Rover',
    size: 'EU 42 (US 9), Ancho: 2E',
    fitScore: 92,
    fitLabel: 'Calce Perfecto',
    blurb: 'Muy cómodas para anchos',
    imageVariant: 'left',
    imageUrl: shoeImages.nikeAvaRover,
  },
  {
    brand: 'Nike',
    model: 'SB Dunk Low Pro',
    size: 'EU 42 (US 9), Ancho: 2E',
    fitScore: 85,
    fitLabel: 'Levemente Holgado',
    blurb: 'Ideal si usas plantillas',
    imageVariant: 'right',
    imageUrl: shoeImages.nikeSbDunkLowPro,
  },
  {
    brand: 'HOKA',
    model: 'Clifton 9',
    size: 'EU 42, Ancho: D/2E',
    fitScore: 88,
    fitLabel: 'Calce Perfecto',
    blurb: 'Muy cómodas para pies anchos',
    imageVariant: 'left',
    imageUrl: shoeImages.hokaClifton9,
  },
  {
    brand: 'Vans',
    model: 'Rowley Classic',
    size: 'EU 42, Ancho: D',
    fitScore: 82,
    fitLabel: 'Levemente Holgado',
    blurb: 'Ideal si usas plantillas',
    imageVariant: 'right',
    imageUrl: shoeImages.vansRowleyClassic,
  },
  {
    brand: 'On',
    model: 'Cloudrunner',
    size: 'EU 42, Ancho: D',
    fitScore: 80,
    fitLabel: 'Levemente Holgado',
    blurb: 'Ideal si usas plantillas',
    imageVariant: 'left',
    imageUrl: shoeImages.onShoe,
  },
]

