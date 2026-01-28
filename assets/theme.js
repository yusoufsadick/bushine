/* ===============================================
   RASHINE - Premium Valentine Theme
   Core JavaScript Functionality
   =============================================== */

(function() {
  'use strict';

  // ===== Header Sticky Behavior =====
  const initStickyHeader = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScroll = currentScroll;
    });
  };

  // ===== Mobile Menu Toggle =====
  const initMobileMenu = () => {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');

    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('is-open');
      
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (menuOverlay) {
      menuOverlay.addEventListener('click', closeMobileMenu);
    }

    function openMobileMenu() {
      mobileMenu.classList.add('is-open');
      menuToggle.classList.add('is-active');
      if (menuOverlay) menuOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      mobileMenu.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      if (menuOverlay) menuOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        closeMobileMenu();
      }
    });
  };

  // ===== Search Functionality =====
  const initSearch = () => {
    const searchToggle = document.querySelector('.search-toggle');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    const searchClose = document.querySelector('.search-close');

    if (!searchToggle || !searchForm) return;

    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchForm.classList.add('is-active');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 100);
      }
    });

    if (searchClose) {
      searchClose.addEventListener('click', () => {
        searchForm.classList.remove('is-active');
      });
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchForm.classList.contains('is-active')) {
        searchForm.classList.remove('is-active');
      }
    });
  };

  // ===== Cart Functionality =====
  const initCart = () => {
    const cartToggle = document.querySelector('.cart-toggle');
    const miniCart = document.querySelector('.mini-cart');
    const cartClose = document.querySelector('.cart-close');
    const cartOverlay = document.querySelector('.cart-overlay');

    if (!cartToggle || !miniCart) return;

    cartToggle.addEventListener('click', (e) => {
      e.preventDefault();
      miniCart.classList.add('is-open');
      if (cartOverlay) cartOverlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });

    if (cartClose) {
      cartClose.addEventListener('click', closeCart);
    }

    if (cartOverlay) {
      cartOverlay.addEventListener('click', closeCart);
    }

    function closeCart() {
      miniCart.classList.remove('is-open');
      if (cartOverlay) cartOverlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }

    // Update cart count
    const updateCartCount = () => {
      fetch(window.routes.cart_url + '.js')
        .then(response => response.json())
        .then(cart => {
          const cartCount = cart.item_count || 0;
          const countElements = document.querySelectorAll('.cart-count');
          countElements.forEach(el => {
            el.textContent = cartCount;
            el.style.display = cartCount > 0 ? 'inline-block' : 'none';
          });
        })
        .catch(error => console.error('Error updating cart count:', error));
    };

    // Listen for cart updates
    document.addEventListener('cart:updated', updateCartCount);
    updateCartCount();
  };

  // ===== Image Lazy Loading =====
  const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for older browsers
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
      });
    }
  };

  // ===== Dropdown Menus =====
  const initDropdowns = () => {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('.dropdown-trigger');
      const menu = dropdown.querySelector('.dropdown-menu');

      if (!trigger || !menu) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('is-open');
        
        // Close all other dropdowns
        dropdowns.forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('is-open');
          }
        });

        // Toggle current dropdown
        dropdown.classList.toggle('is-open', !isOpen);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('is-open');
        });
      }
    });
  };

  // ===== Smooth Scroll =====
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  // ===== Product Quick Add =====
  const initQuickAdd = () => {
    const quickAddButtons = document.querySelectorAll('.quick-add-btn');
    
    quickAddButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const form = button.closest('form') || button.closest('.product-card');
        const variantId = button.dataset.variantId;
        
        if (!variantId) return;

        button.classList.add('loading');
        button.disabled = true;

        try {
          const response = await fetch(window.routes.cart_add_url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: [{
                id: variantId,
                quantity: 1
              }]
            })
          });

          if (response.ok) {
            document.dispatchEvent(new CustomEvent('cart:updated'));
            
            // Show success message
            showNotification('Product added to cart!', 'success');
            
            // Open mini cart
            const miniCart = document.querySelector('.mini-cart');
            if (miniCart) {
              miniCart.classList.add('is-open');
            }
          } else {
            throw new Error('Failed to add to cart');
          }
        } catch (error) {
          console.error('Error adding to cart:', error);
          showNotification('Failed to add product to cart', 'error');
        } finally {
          button.classList.remove('loading');
          button.disabled = false;
        }
      });
    });
  };

  // ===== Notification System =====
  const showNotification = (message, type = 'info') => {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('is-visible');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('is-visible');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  };

  // ===== Initialize Everything =====
  const init = () => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initStickyHeader();
    initMobileMenu();
    initSearch();
    initCart();
    initLazyLoading();
    initDropdowns();
    initSmoothScroll();
    initQuickAdd();
  };

  // Start initialization
  init();

  // Re-initialize on dynamic content load (for Shopify sections)
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', init);
    document.addEventListener('shopify:section:reorder', init);
  }

})();
