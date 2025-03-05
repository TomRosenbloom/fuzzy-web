import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App Integration', () => {
  it('renders the Fuzzy title', () => {
    render(<App />)
    expect(screen.getByText('Fuzzy')).toBeInTheDocument()
  })

  it('handles fuzziness slider interactions correctly', () => {
    render(<App />)
    
    // Find the fuzziness slider
    const slider = screen.getByRole('slider')
    expect(slider).toBeInTheDocument()
    
    // Initial value should be 0
    expect(slider.value).toBe('0')
    
    // Check maximum value is 60
    expect(slider.max).toBe('60')
    
    // Set to valid value (10 minutes)
    fireEvent.change(slider, { target: { value: '10' } })
    expect(screen.getByText('10 minutes fuzziness')).toBeInTheDocument()
    
    // Try to set above 25% of 1 hour (15 minutes)
    fireEvent.change(slider, { target: { value: '20' } })
    expect(screen.getByText(/Maximum Fuzziness Reached/)).toBeInTheDocument()
  })
}) 