import { useState, useEffect } from 'react'
import './CatalogPage.css'

export default function CatalogPage({ onBack }) {
  const [hairstyles, setHairstyles] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHairstyle, setSelectedHairstyle] = useState(null)
  const placeholderImage = 'https://i.postimg.cc/zGWw7JxK/mens-haircuts-military-fade.jpg'

  useEffect(() => {
    // Mock data for hairstyles
    const hairstyleItems = [
      {
        id: 1,
        name: 'Classic Taper',
        image: 'https://i.postimg.cc/zGWw7JxK/mens-haircuts-military-fade.jpg',
      },
      {
        id: 2,
        name: 'Fade',
        price: '$40',
        description: 'A modern haircut with seamless transition from short to long hair.',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
        details: 'Choose from low, mid, or high fade. This cut requires regular maintenance every 2-3 weeks for optimal sharpness.'
      },
      {
        id: 3,
        name: 'Bald Fade',
        price: '$45',
        description: 'A dramatic fade that transitions to completely bald on the sides.',
        image: 'https://images.unsplash.com/photo-1508654472847-b58d54348590?auto=format&fit=crop&w=800&q=80',
        details: 'Highly popular for its clean, polished look. Perfect for those who want a bold, modern appearance.'
      },
      {
        id: 4,
        name: 'Pompadour',
        price: '$50',
        description: 'A classic style with volume on top and tapered sides.',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
        details: 'Requires styling products for maintenance. Our barbers will show you how to style it at home.'
      },
      {
        id: 5,
        name: 'Undercut',
        price: '$40',
        description: 'Short sides with longer hair on top for a bold contrast.',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80',
        details: 'Versatile and low-maintenance, can be styled in multiple ways for different occasions.'
      },
      {
        id: 6,
        name: 'Textured Crop',
        price: '$35',
        description: 'Short, textured hair on top with clean sides.',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=800&q=80',
        details: 'Perfect for a casual, effortless look. Works well with natural hair texture.'
      },
      {
        id: 7,
        name: 'French Crop',
        price: '$38',
        description: 'Short front with longer top and textured finish.',
        image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80',
        details: 'A stylish, low-maintenance option that works for most hair types.'
      },
      {
        id: 8,
        name: 'Side Part',
        price: '$35',
        description: 'Classic side part with clean lines and polished finish.',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6e9d?auto=format&fit=crop&w=800&q=80',
        details: 'A timeless look that never goes out of style. Perfect for formal occasions.'
      }
    ]

    setTimeout(() => {
      setHairstyles(hairstyleItems)
      setLoading(false)
    }, 500)
  }, [])

  const filteredHairstyles = hairstyles.filter(hairstyle => 
    hairstyle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hairstyle.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openLightbox = (hairstyle) => {
    setSelectedHairstyle(hairstyle)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedHairstyle(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <button className="catalog-back-button" onClick={onBack}>← Back</button>
        <h1>Hair Catalog</h1>
      </header>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search hairstyles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Hairstyles Grid */}
      <section className="products-grid">
        {loading ? (
          <p className="loading-products">Loading hairstyles...</p>
        ) : filteredHairstyles.length === 0 ? (
          <p className="no-products">No hairstyles found.</p>
        ) : (
          filteredHairstyles.map(hairstyle => (
            <div 
              key={hairstyle.id} 
              className="catalog-product-card"
              onClick={() => openLightbox(hairstyle)}
            >
              <div className="catalog-product-image">
                <img
                  src={hairstyle.image}
                  alt={hairstyle.name}
                  loading="lazy"
                  onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
                />
              </div>
              <div className="catalog-product-info">
                <h3>{hairstyle.name}</h3>                
              </div>
            </div>
          ))
        )}
      </section>

      {/* Lightbox */}
      {selectedHairstyle && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <div className="catalog-lightbox-product-card">
              <img
                src={selectedHairstyle.image}
                alt={selectedHairstyle.name}
                loading="lazy"
                onError={(e) => { e.target.onerror = null; e.target.src = placeholderImage }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}