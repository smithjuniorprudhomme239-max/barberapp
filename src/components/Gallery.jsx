import { useState, useEffect } from 'react'
import './Gallery.css'

const photos = [
    'https://i.postimg.cc/G3NKT651/ca8e3d0da04c9.png',
  'https://i.postimg.cc/bwMSmj1D/16469749dce31.png',
  'https://i.postimg.cc/sDbrhR60/jimeng-2026-03-29-3383-make-this-picture-more-clear-and-higher.png',
  'https://i.postimg.cc/8cyqL4xQ/b4d3697f32db8.png',
  'https://i.postimg.cc/d1JsBWNw/fa9fe0865cf9a.png',
  'https://i.postimg.cc/cL7Pmdpm/fccff0abbc93e.png',
  'https://i.postimg.cc/W1DwN8nv/569ea474542e8.png',
  'https://i.postimg.cc/KjPvr6xB/2335b54f51a058.png',
  'https://i.postimg.cc/W3cB6h3y/8d096ebb6ebf38.png'
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [showAll, setShowAll] = useState(false)

  // Set initial state based on screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setShowAll(window.innerWidth >= 768) // Show all on desktop, only one on mobile
    }

    // Set initial state
    checkScreenSize()

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize)

    // Clean up event listener
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const openLightbox = (src) => {
    setSelectedImage(src)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = 'auto'
  }

  const displayPhotos = showAll ? photos : photos.slice(0, 1)

  return (
    <section id="gallery" className="section gallery">
      <h2>Gallery</h2>
      <div className="grid">
        {displayPhotos.map((src, i) => (
          <img 
            key={i} 
            src={src} 
            alt={`cut-${i}`} 
            loading="lazy"
            onClick={() => openLightbox(src)}
            className="gallery-image"
          />
        ))}
      </div>
      <div className="gallery-mobile-footer">
        <button className="view-more-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'View Less' : 'View More'}
        </button>
      </div>

      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <img src={selectedImage} alt="Enlarged view" />
          </div>
        </div>
      )}
    </section>
  )
}