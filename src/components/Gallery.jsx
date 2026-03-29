import { useState } from 'react'
import './Gallery.css'

const photos = [
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600',
  'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600',
  'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=600',
]

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [showAll, setShowAll] = useState(true)

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