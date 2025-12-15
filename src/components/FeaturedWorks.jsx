import React from 'react';
import { useNavigate } from 'react-router-dom';

function FeaturedWorks() {
  const navigate = useNavigate();

  // Featured products configuration with product IDs
  const featuredProducts = [
    { id: '1765824528699-bjw809szq', name: 'Pyramid Head', image: '/images/pyramid-head.png', description: 'Figura coleccionable', price: '$ 50.000' },
    { id: '1765824278927-jknw590ny', name: 'Head-1', image: '/images/head-1.png', description: 'Porta audífonos', price: '$ 70.000' },
    { id: '1765824432993-p0yec3uof', name: 'Okus', image: '/images/okus.png', description: 'Mesa de noche', price: '$ 200.000' },
    { name: 'Repuestos Singer', image: '/images/repuestos-cosedora-singer.png', description: 'Piezas mecánicas', price: '$ 30.000' }
  ];

  const handleProductClick = (productId) => {
    if (productId) {
      navigate(`/producto/${productId}`);
    } else {
      navigate('/404');
    }
  };

  return (
    <section className="featured-works">
      <div className="featured-works-container">
        <h2 className="section-title">TRABAJOS DESTACADOS</h2>
        
        <div className="featured-works-grid">
          {featuredProducts.map((product, index) => (
            <div 
              key={index}
              className="product-card"
              onClick={() => handleProductClick(product.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="featured-product-image">
                <img 
                  src={product.image} 
                  alt={`${product.name} ${product.description}`}
                  className="featured-product-img"
                />
              </div>
              <div className="product-info">
                <h3 className="featured-product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price" style={{marginTop: '3px'}}>{product.price}</p>
                <button 
                  className="featured-ver-mas-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProductClick(product.id);
                  }}
                >
                  Ver más
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedWorks; 