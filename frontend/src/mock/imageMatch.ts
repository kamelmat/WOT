import { shoeImages } from '../assets/shoes'

export function matchImage(brand: string, model: string): string | undefined {
  const b = brand.toLowerCase()
  const m = model.toLowerCase()

  if (b.includes('nike') && m.includes('ava')) return shoeImages.nikeAvaRover
  if (b.includes('nike') && m.includes('dunk')) return shoeImages.nikeSbDunkLowPro
  if (b.includes('hoka') && m.includes('clifton')) return shoeImages.hokaClifton9
  if (b.includes('vans') && m.includes('rowley')) return shoeImages.vansRowleyClassic
  if (b.includes('vans') && (m.includes('ultrarange') || m.includes('ultra'))) return shoeImages.vansUltraRange20
  if (b === 'on' || b.includes('on ')) return shoeImages.onShoe

  return undefined
}

