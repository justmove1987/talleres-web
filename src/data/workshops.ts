export type Workshop = {
  id: string
  title: string
  description: string
  date: string
  capacity: number
  image: string
}

export const workshops: Workshop[] = [
  {
    id: "1",
    title: "Caravaggio: luz y dramatismo",
    description: "Exploración práctica del claroscuro y la iluminación dramática.",
    date: "2026-05-10",
    capacity: 10,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    id: "2",
    title: "Brueghel: paisaje y vegetación",
    description: "Análisis y práctica de composición natural y detalle en el paisaje.",
    date: "2026-05-15",
    capacity: 8,
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  },
  {
    id: "3",
    title: "Plein Air en Besalú",
    description: "Pintura al óleo al aire libre junto al río Fluvià.",
    date: "2026-06-01",
    capacity: 12,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470"
  }
]