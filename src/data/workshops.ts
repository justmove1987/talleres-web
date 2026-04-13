export type Workshop = {
  id: string
  title: string
  description: string
  date: string
  capacity: number
}

export const workshops: Workshop[] = [
  {
    id: "1",
    title: "Pintura para principiantes",
    description: "Aprende técnicas básicas de pintura",
    date: "2026-05-10",
    capacity: 10,
  },
  {
    id: "2",
    title: "Cerámica creativa",
    description: "Crea tus propias piezas de cerámica",
    date: "2026-05-15",
    capacity: 8,
  },
]