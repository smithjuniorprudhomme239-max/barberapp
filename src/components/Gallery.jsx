import { useState, useEffect } from 'react'
import './Gallery.css'

const photos = [
  'https://i.postimg.cc/sDbrhR60/jimeng-2026-03-29-3383-make-this-picture-more-clear-and-higher.png',
  'https://i.postimg.cc/sDbrhR60/jimeng-2026-03-29-3383-make-this-picture-more-clear-and-higher.png',
  'https://i.postimg.cc/sDbrhR60/jimeng-2026-03-29-3383-make-this-picture-more-clear-and-higher.png',
  'https://i.postimg.cc/sDbrhR60/jimeng-2026-03-29-3383-make-this-picture-more-clear-and-higher.png',
  'https://i.postimg.cc/sDbrhR60/jimeng-2026-03-29-3383-make-this-picture-more-clear-and-higher.png',
  'https://i.postimg.cc/sDbrhR60/jimeng-2026-03-29-3383-make-this-picture-more-clear-and-higher.png',
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