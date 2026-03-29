import './About.css'

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="about-inner">
        <img src="https://i.postimg.cc/rpL8RLnW/jimeng-2026-03-29-8449-clean-the-mirror.png" alt="barber" />
        <div className="about-text">
          <h2>About Us</h2>
          <p>
            DuckensBarber has been serving the community for over 2 years. We believe every client
            deserves a premium experience — from the moment you walk in to the moment you leave
            looking your best.
          </p>
          <p>
            Our barber is a highly trained professional passionate about their craft. Whether
            you want a classic cut or the latest trend, we've got you covered.
          </p>
          <div className="stats">
            <div><strong>2+</strong><span>Years Open</span></div>
            <div><strong>200</strong><span>Happy Clients</span></div>
            <div><strong>1</strong><span>Expert Barber</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}