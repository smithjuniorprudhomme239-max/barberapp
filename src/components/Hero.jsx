import './Hero.css'

export default function Hero({ onMarketClick }) {
  return (
    <section id="hero" className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>Look Sharp.<br />Feel Confident.</h1>
        <p>Premium cuts & grooming in the heart of the city.</p>
        <div className="hero-buttons">
          <a href="#contact" className="hero-btn">Book an Appointment</a>
          <button onClick={onMarketClick} className="hero-btn market-btn">Market</button>
        </div>
      </div>
    </section>
  )
}