import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/apiService';
import './WorkshopProducts.css';

// Helper function to get products per slide based on screen width
const getProductsPerSlide = () => {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1024) return 3;
  return 4;
};

function WorkshopProducts() {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [productsPerSlide, setProductsPerSlide] = useState(getProductsPerSlide());

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await dashboardService.getProducts();
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();

    // Add resize listener to update products per slide
    const handleResize = () => {
      setProductsPerSlide(getProductsPerSlide());
      setCurrentSlide(0); // Reset to first slide when resizing
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / productsPerSlide));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? Math.ceil(products.length / productsPerSlide) - 1 : prev - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const getVisibleProducts = () => {
    const startIndex = currentSlide * productsPerSlide;
    return products.slice(startIndex, startIndex + productsPerSlide);
  };

  const totalSlides = Math.ceil(products.length / productsPerSlide);

  if (loading) {
    return (
      <section className="workshop-products-section">
        <div className="workshop-products-container">
          <h2 className="workshop-products-title">LO QUE HACEMOS EN EL TALLER</h2>
          <div className="loading-spinner">Cargando productos...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="workshop-products-section">
      <div className="workshop-products-container">
        <h2 className="workshop-products-title">LO QUE HACEMOS EN EL TALLER</h2>
        
        <div className="products-carousel">
          <div className="carousel-container">
            <div className="carousel-track">
              {getVisibleProducts().map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="product-photo"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-price">$ {product.price}</p>
                    <div className="product-actions">
                      <button className="action-btn cart-btn" aria-label="Agregar al carrito">
                        <img src="/images/cart.svg" alt="Carrito" />
                      </button>
                      <button className="action-btn favorite-btn" aria-label="Agregar a favoritos">
                        <img src="/images/favorito.svg" alt="Favorito" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {products.length > productsPerSlide && (
              <>
                <button 
                  className="carousel-nav prev-btn" 
                  onClick={prevSlide}
                  aria-label="Producto anterior"
                >
                  <img src="/images/next-arrow.svg" alt="Anterior" className="nav-icon prev-icon" />
                </button>
                <button 
                  className="carousel-nav next-btn" 
                  onClick={nextSlide}
                  aria-label="Siguiente producto"
                >
                  <img src="/images/next-arrow.svg" alt="Siguiente" className="nav-icon next-icon" />
                </button>
              </>
            )}
          </div>
          
          {totalSlides > 1 && (
            <div className="carousel-dots">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                  aria-label={`Ir a slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default WorkshopProducts;
