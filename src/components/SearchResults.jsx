import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/apiService';

function SearchResults({ searchQuery, isActive, onClose, searchValue, onSearchChange }) {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [showNoResults, setShowNoResults] = useState(false);

  // Fetch products and services when search becomes active
  useEffect(() => {
    if (isActive && searchQuery && searchQuery.trim().length > 0) {
      // Hide "no results" message while typing
      setShowNoResults(false);
      
      // Debounce the search
      const timeoutId = setTimeout(() => {
        fetchData(searchQuery);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else {
      // Clear results immediately when search is cleared
      setFilteredProducts([]);
      setFilteredServices([]);
      setLoading(false);
      setShowNoResults(false);
    }
  }, [isActive, searchQuery]);

  const fetchData = async (query) => {
    setLoading(true);
    try {
      const [productsData, servicesData] = await Promise.all([
        dashboardService.getProducts(),
        dashboardService.getServices()
      ]);
      
      setProducts(productsData);
      setServices(servicesData);
      
      // Filter products
      const searchTerm = query.toLowerCase().trim();
      const filteredProds = productsData.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.materials?.some(m => m?.toLowerCase().includes(searchTerm)) ||
        product.colours?.some(c => c?.toLowerCase().includes(searchTerm))
      );
      
      // Filter services
      const filteredServs = servicesData.filter(service =>
        service.name?.toLowerCase().includes(searchTerm) ||
        service.category?.toLowerCase().includes(searchTerm) ||
        service.duration?.toLowerCase().includes(searchTerm)
      );
      
      setFilteredProducts(filteredProds);
      setFilteredServices(filteredServs);
      
      // Show "no results" message only after search completes and there are no results
      if (filteredProds.length === 0 && filteredServs.length === 0) {
        // Add a small delay before showing "no results" message
        setTimeout(() => {
          setShowNoResults(true);
        }, 500);
      } else {
        setShowNoResults(false);
      }
    } catch (error) {
      setFilteredProducts([]);
      setFilteredServices([]);
      setShowNoResults(false);
    } finally {
      setLoading(false);
    }
  };

  if (!isActive) {
    return null;
  }

  const handleProductClick = (productId) => {
    navigate(`/producto/${productId}`);
    onClose();
  };

  const hasResults = filteredProducts.length > 0 || filteredServices.length > 0;
  const hasQuery = searchQuery && searchQuery.trim().length > 0;

  return (
    <div className="search-results-overlay" onClick={onClose}>
      <div className="search-results-container" onClick={(e) => e.stopPropagation()}>
        {/* Search Bar */}
        <div className="search-results-search-bar">
          <div className="search-container">
            <input 
              type="text" 
              placeholder="¿Qué estás buscando?" 
              className="search-input"
              value={searchValue || ''}
              onChange={onSearchChange}
              autoFocus
            />
            <button 
              className="search-results-close-btn"
              onClick={onClose}
              aria-label="Cerrar búsqueda"
            >
              <img 
                src="/images/x.svg" 
                alt="Clear search" 
                width="18" 
                height="18"
              />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="search-results-loading">Buscando...</div>
        ) : (
          <>
            {!hasQuery ? (
              <div className="search-results-empty">
                Escribe para buscar productos y servicios
              </div>
            ) : hasResults ? (
              <>
                {filteredProducts.length > 0 && (
                  <div className="search-results-section">
                    <h3 className="search-results-title">Productos</h3>
                    <div className="search-results-grid">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="search-result-item product-item"
                          onClick={() => handleProductClick(product.id)}
                        >
                          {product.images && product.images.length > 0 && (
                            <div className="search-result-image">
                              <img src={product.images[0]} alt={product.name} />
                            </div>
                          )}
                          <div className="search-result-content">
                            <h4 className="search-result-name">{product.name}</h4>
                            <p className="search-result-price">${product.price}</p>
                            {product.description && (
                              <p className="search-result-description">
                                {product.description.length > 200
                                  ? `${product.description.substring(0, 200)}...`
                                  : product.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredServices.length > 0 && (
                  <div className="search-results-section">
                    <h3 className="search-results-title">Servicios</h3>
                    <div className="search-results-list">
                      {filteredServices.map((service) => (
                        <div
                          key={service.id}
                          className="search-result-item service-item"
                        >
                          <div className="search-result-content">
                            <h4 className="search-result-name">{service.name}</h4>
                            <div className="search-result-meta">
                              <span className="search-result-price">${service.price}</span>
                              {service.duration && (
                                <span className="search-result-duration">{service.duration}</span>
                              )}
                              {service.category && (
                                <span className="search-result-category">{service.category}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : showNoResults ? (
              <div className="search-results-empty">
                No se encontraron resultados para "{searchQuery}"
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchResults;

