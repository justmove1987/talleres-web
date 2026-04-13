import { render, screen } from '@testing-library/react'
import App from './App'

test('renderiza el texto principal', () => {
  render(<App />)
  expect(screen.getByText(/vite/i)).toBeInTheDocument()
})