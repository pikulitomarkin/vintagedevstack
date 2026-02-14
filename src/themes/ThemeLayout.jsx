import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * ThemeLayout - Componente base para todos os temas
 * Gerencia lazy loading de background images e estrutura comum
 */
const ThemeLayout = ({ 
  backgroundImage, 
  overlayStyle, 
  children, 
  className = '',
  useFixedBg = true,
  extraElements = null 
}) => {
  const bgRef = useRef(null);

  useEffect(() => {
    // Lazy load background com IntersectionObserver
    const el = bgRef.current;
    if (!el) return;

    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              el.style.backgroundImage = `url('${backgroundImage}')`;
              observer.unobserve(el);
            }
          });
        },
        { rootMargin: '200px' }
      );
      io.observe(el);
      
      return () => io.disconnect();
    } else {
      // Fallback para navegadores sem IntersectionObserver
      el.style.backgroundImage = `url('${backgroundImage}')`;
    }
  }, [backgroundImage]);

  return (
    <div className={`theme-container ${className}`}>
      <div 
        ref={bgRef}
        className={`theme-bg ${useFixedBg ? 'fixed-bg' : ''}`}
        aria-hidden="true"
      />
      <div 
        className="theme-overlay" 
        style={overlayStyle}
        aria-hidden="true"
      />
      {extraElements}
      <div className="theme-content">
        {children}
      </div>
    </div>
  );
};

ThemeLayout.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  overlayStyle: PropTypes.object,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  useFixedBg: PropTypes.bool,
  extraElements: PropTypes.node
};

export default ThemeLayout;