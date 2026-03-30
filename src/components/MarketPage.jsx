import { useState, useEffect } from 'react'
import { supabase, useAuth } from '../context/AuthContext'
import './MarketPage.css'

export default function MarketPage({ onBack }) {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products from Supabase...')
        const { data, error } = await supabase
          .from('products')
          .select('*')
        
        if (error) {
          console.error('Error fetching products:', error)
          setLoading(false)
        } else {
          console.log('Products fetched successfully:', data)
          setProducts(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      } catch (error) {
        console.error('Unexpected error fetching products:', error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const parsePrice = (price) => {
    if (typeof price === 'number') return price
    const numeric = parseFloat(price?.toString().replace(/[^0-9.-]+/g, ''))
    return Number.isFinite(numeric) ? numeric : 0
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cart.reduce((sum, item) => sum + parsePrice(item.price) * item.quantity, 0)

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const updateCartQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeCartItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
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

  const checkout = async () => {
    if (!user) {
      setCheckoutError('Please login to submit your cart')
      return
    }

    if (cart.length === 0) {
      setCheckoutError('Your cart is empty')
      return
    }

    setCheckingOut(true)
    setCheckoutError('')
    setCheckoutSuccess(false)

    const orderItems = cart.map((item) => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit_price: parsePrice(item.price),
      subtotal: parsePrice(item.price) * item.quantity,
      image: item.image
    }))

    const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0)

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          user_email: user.email,
          items: orderItems,
          total,
          status: 'pending'
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating order:', error)
        setCheckoutError('Failed to submit cart')
      } else {
        console.log('Order created successfully:', data)
        setCheckoutSuccess(true)
        setCart([])
        setShowCart(false)
        setTimeout(() => setCheckoutSuccess(false), 3000)
      }
    } catch (error) {
      console.error('Error checking out:', error)
      setCheckoutError('Failed to submit cart')
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="market-page">
      {/* Header */}
      <header className="market-header">
        <button className="back-button" onClick={onBack}>← Back</button>
        <h1>Market</h1>
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
          <div className="cart-header-row">
            <h2>Your Cart</h2>
            <div className="cart-count">
              <span>{cart.length} item types</span>
              <span>{cartItemCount} total items</span>
              <span>Total: {formatCurrency(cartTotal)}</span>
            </div>
          </div>

          <div className="cart-items">
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-details">
                    <div>
                      <span className="cart-item-name">{item.name}</span>
                      <span className="cart-item-price">{formatCurrency(parsePrice(item.price))} each</span>
                    </div>
                    <div className="cart-item-actions">
                      <button type="button" onClick={() => updateCartQuantity(item.id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateCartQuantity(item.id, 1)}>+</button>
                      <span className="cart-item-subtotal">{formatCurrency(parsePrice(item.price) * item.quantity)}</span>
                      <button type="button" className="remove-item-btn" onClick={() => removeCartItem(item.id)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-cart">Your cart is empty</p>
            )}
          </div>

          {checkoutError && (
            <div className="error-message">{checkoutError}</div>
          )}
          {checkoutSuccess && (
            <div className="success-message">Cart submitted successfully!</div>
          )}

          {cart.length > 0 && (
            <div className="cart-actions-row">
              <button type="button" className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>
              <button 
                className="checkout-btn"
                onClick={checkout}
                disabled={checkingOut}
              >
                {checkingOut ? 'Submitting...' : 'Submit Cart'}
              </button>
            </div>
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
                  onClick={(e) => {
                    e.stopPropagation()
                    addToCart(selectedProduct)
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