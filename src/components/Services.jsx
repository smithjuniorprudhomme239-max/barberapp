import { useState, useEffect } from 'react'
import './Services.css'

const services = [
  { name: 'Classic Haircut', price: '$25', desc: 'Clean cut tailored to your style.' },
  { name: 'Fade & Taper', price: '$30', desc: 'Sharp fades from skin to length.' },
  { name: 'Beard Trim', price: '$15', desc: 'Shape and define your beard.' },
  { name: 'Hot Towel Shave', price: '$45', desc: 'Traditional straight razor shave.' },
  { name: 'Hair + Beard Combo', price: '$40', desc: 'Full grooming package.' },
  { name: 'Kids Cut', price: '$25', desc: 'For the little ones, age 12 & under.' },
]

export default function Services() {
  const [showAll, setShowAll] = useState(false)
  
  // Set initial state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setShowAll(window.innerWidth >= 768) // Show all on desktop, only 3 on mobile
    }

    // Set initial state
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Clean up event listener
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])
  
  const displayServices = showAll ? services : services.slice(0, 3)
  
  return (
    <section id="services" className="section services">
      <h2>Our Services</h2>
      <div className="cards">
        {displayServices.map(s => (
          <div key={s.name} className="card">
            <h3>{s.name}</h3>
            <p>{s.desc}</p>
            <span className="price">{s.price}</span>
          </div>
        ))}
      </div>
      <div className="services-mobile-footer">
        <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'View Less' : 'View More'}
        </button>
      </div>
    </section>
  )
}