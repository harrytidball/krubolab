import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from './Header';
import NotFound from './NotFound';
import { getStickerBySlug } from '../data/stickers';
import './StickerPage.css';

const MOBILE_QUERY = '(max-width: 1024px)';

function StickerPage() {
  const { slug } = useParams();
  const sticker = getStickerBySlug(slug);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const onChange = (event) => setIsMobile(event.matches);
    media.addEventListener('change', onChange);
    setIsMobile(media.matches);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!sticker) return;

    window.scrollTo(0, 0);
    const previousTitle = document.title;
    document.title = `${sticker.label} | Stickers | Krubo`;

    return () => {
      document.title = previousTitle;
    };
  }, [sticker]);

  if (!sticker) {
    return <NotFound />;
  }

  return (
    <div className="sticker-page">
      <Header />

      <main className="sticker-main">
        {isMobile ? (
          <div className="sticker-image-wrap sticker-image-wrap-top sticker-top-mobile">
            <img
              src={`/images/stickers/${sticker.slug}-top-left.jpg`}
              alt=""
              className="sticker-image"
            />
            <img
              src={`/images/stickers/${sticker.slug}-top-right.jpg`}
              alt={sticker.alt}
              className="sticker-image"
            />
          </div>
        ) : (
          <div className="sticker-image-wrap sticker-image-wrap-top">
            <img
              src={`/images/stickers/${sticker.slug}-top.jpg`}
              alt={sticker.alt}
              className="sticker-image sticker-image-top"
              width="3200"
              height="2100"
            />
          </div>
        )}

        <section className="sticker-cta">
          <p className="sticker-cta-text">
            POR CADA STICKER PUBLICADO EN TUS HISTORIAS SUMAS{' '}
            <span className="sticker-cta-amount">$10.000</span> A TU BONO DE IMPRESIÓN
          </p>

          <div className="sticker-cta-buttons">
            <a
              href="https://www.instagram.com/krubolab/"
              target="_blank"
              rel="noopener noreferrer"
              className="sticker-cta-button"
            >
              INSTAGRAM
            </a>
            <Link to="/" className="sticker-cta-button">
              KRUBOLAB.COM
            </Link>
          </div>
        </section>

        {isMobile ? (
          <section className="sticker-prize">
            <div className="sticker-prize-banner">
              <div className="sticker-prize-block">
                <p className="sticker-prize-kicker">COMPLETA LOS 6</p>
                <p className="sticker-prize-highlight">Y DESBLOQUEA TU PREMIO</p>
              </div>
              <div className="sticker-prize-divider" />
              <div className="sticker-prize-block">
                <p className="sticker-prize-kicker">HASTA</p>
                <p className="sticker-prize-amount">$60.000</p>
                <p className="sticker-prize-kicker">EN FABRICACIÓN 3D</p>
              </div>
            </div>
            <div className="sticker-prize-legal">
              <p className="sticker-prize-disclaimer">
                El beneficio aplica a una sola fabricación 3D. El valor corresponde
                exclusivamente al servicio de fabricación; diseño, modelado o
                materiales especiales pueden tener costo adicional. Vigencia: 21
                agosto – 18 septiembre. Aplican términos y condiciones.
              </p>
              <img
                src="/images/krubo-logo.png"
                alt="KRUBO LAB"
                className="sticker-prize-logo"
              />
            </div>
          </section>
        ) : (
          <div className="sticker-image-wrap sticker-image-wrap-bottom">
            <img
              src={`/images/stickers/${sticker.slug}-bottom.png`}
              alt="Completa los 6 y desbloquea tu premio. Hasta $60.000 en fabricación 3D."
              className="sticker-image sticker-image-bottom"
              width="2002"
              height="576"
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default StickerPage;
