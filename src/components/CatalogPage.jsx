import { useState, useEffect } from 'react'
import './CatalogPage.css'

export default function CatalogPage({ onBack }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    // Mock data for catalog items
    const catalogItems = [
      { id: 1, name: 'Hair Pomade', price: '$20', description: 'Premium hair pomade for a strong hold and natural shine.', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
      { id: 2, name: 'Beard Oil', price: '$15', description: 'Nourishing beard oil to keep your beard soft and healthy.', image: 'https://images.unsplash.com/photo-1619983081215-1b024077b443?w=400' },
      { id: 3, name: 'Shaving Cream', price: '$12', description: 'Rich shaving cream for a smooth and comfortable shave.', image: 'https://images.unsplash.com/photo-1604537466158-710b1972feb8?w=400' },
      { id: 4, name: 'Aftershave', price: '$18', description: 'Refreshing aftershave to soothe and hydrate skin after shaving.', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400' },
      { id: 5, name: 'Hair Comb', price: '$8', description: 'Handcrafted wooden hair comb for styling and detangling.', image: 'https://images.unsplash.com/photo-1623290882453-c043c46a2d77?w=400' },
      { id: 6, name: 'Beard Brush', price: '$10', description: 'Natural bristle beard brush for grooming and styling.', image: 'https://images.unsplash.com/photo-1619983081215-1b024077b443?w=400' },
    ]

    setTimeout(() => {
      setProducts(catalogItems)
      setLoading(false)
    }, 500)
  }, [])

  const addToCart = (product) => {
    setCart([...cart, product])
  }

  const toggleCart = () => {
    setShowCart(!showCart)
  }

  const openLightbox = (product) => {
    setSelectedProduct(product)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setSelectedProduct(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className="catalog-page">
      <header className="catalog-header">
        <button className="catalog-back-button" onClick={onBack}>← Back</button>
        <h1>Catalog</h1>
        <div 
          className="cart-icon"
          onClick={toggleCart}
          style={{ cursor: 'pointer' }}
        >
          🛒 {cart.length}
        </div>
      </header>

      {/* Products Grid */}
      <section className="products-grid">
        {loading ? (
          <p className="loading-products">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="no-products">No products available.</p>
        ) : (
          products.map(product => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => openLightbox(product)}
            >
              <div className="product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="product-price">{product.price}</p>
                <p className="product-description">{product.description}</p>
                <button 
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(product)
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Cart Section */}
      {showCart && (
        <section className="cart-section">
          <h2>Your Cart ({cart.length})</h2>
          <div className="cart-items">
            {cart.length > 0 ? (
              cart.map((item, index) => (
                <div key={index} className="cart-item">
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                </div>
              ))
            ) : (
              <p className="empty-cart">Your cart is empty</p>
            )}
          </div>
          {cart.length > 0 && (
            <button className="checkout-btn">Checkout</button>
          )}
        </section>
      )}

      {/* Lightbox */}
      {selectedProduct && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>×</button>
            <div className="product-card lightbox-product-card">
              <div className="product-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="product-info">
                <h3>{selectedProduct.name}</h3>
                <p className="product-price">{selectedProduct.price}</p>
                <p className="product-description">{selectedProduct.description}</p>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => {
                    addToCart(selectedProduct)
                    closeLightbox()
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}