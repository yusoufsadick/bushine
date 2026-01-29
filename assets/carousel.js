/* ===============================================
   RASHINE - Carousel Functionality
   Lightweight Carousel for Dark SaaS Theme
   =============================================== */

(function() {
  'use strict';

  // Lightweight Carousel Class
  class Carousel {
    constructor(container, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) return;

      this.options = {
        slidesPerView: options.slidesPerView || 1,
        spaceBetween: options.spaceBetween || 20,
        loop: options.loop || false,
        autoplay: options.autoplay || false,
        autoplayDelay: options.autoplayDelay || 3000,
        navigation: options.navigation !== false,
        pagination: options.pagination !== false,
        breakpoints: options.breakpoints || {},
        ...options
      };

      this.slides = this.container.querySelectorAll('.carousel-slide');
      this.currentIndex = 0;
      this.isTransitioning = false;
      this.autoplayTimer = null;

      if (this.slides.length === 0) return;

      this.init();
    }

    init() {
      this.setupContainer();
      this.setupSlides();
      if (this.options.navigation) this.createNavigation();
      if (this.options.pagination) this.createPagination();
      if (this.options.autoplay) this.startAutoplay();
      this.setupTouch();
      this.update();
    }

    setupContainer() {
      this.container.classList.add('carousel-container');
      this.track = this.container.querySelector('.carousel-track') || this.container;
      this.track.style.display = 'flex';
      this.track.style.transition = 'transform 0.5s ease';
      this.track.style.gap = `${this.options.spaceBetween}px`;
    }

    setupSlides() {
      this.slides.forEach((slide, index) => {
        slide.classList.add('carousel-slide');
        slide.style.flex = `0 0 ${100 / this.options.slidesPerView}%`;
        slide.style.minWidth = 0;
      });
    }

    createNavigation() {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'carousel-nav carousel-nav--prev';
      prevBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      prevBtn.addEventListener('click', () => this.prev());

      const nextBtn = document.createElement('button');
      nextBtn.className = 'carousel-nav carousel-nav--next';
      nextBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      nextBtn.addEventListener('click', () => this.next());

      this.container.appendChild(prevBtn);
      this.container.appendChild(nextBtn);
    }

    createPagination() {
      const pagination = document.createElement('div');
      pagination.className = 'carousel-pagination';
      
      for (let i = 0; i < this.getSlideCount(); i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-pagination-dot';
        if (i === 0) dot.classList.add('is-active');
        dot.addEventListener('click', () => this.goTo(i));
        pagination.appendChild(dot);
      }

      this.container.appendChild(pagination);
      this.pagination = pagination;
    }

    setupTouch() {
      let startX = 0;
      let currentX = 0;
      let isDragging = false;

      this.track.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX;
        this.stopAutoplay();
      });

      this.track.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
      });

      this.track.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        
        if (Math.abs(currentX) > 50) {
          if (currentX > 0) this.prev();
          else this.next();
        }
        
        currentX = 0;
        if (this.options.autoplay) this.startAutoplay();
      });

      // Touch events
      this.track.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX;
        this.stopAutoplay();
      });

      this.track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
      });

      this.track.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        if (Math.abs(currentX) > 50) {
          if (currentX > 0) this.prev();
          else this.next();
        }
        
        currentX = 0;
        if (this.options.autoplay) this.startAutoplay();
      });
    }

    getSlideCount() {
      return Math.ceil(this.slides.length / this.options.slidesPerView);
    }

    update() {
      if (this.slides.length === 0) return;
      
      const slideWidth = 100 / this.options.slidesPerView;
      const translateX = -(this.currentIndex * slideWidth);
      this.track.style.transform = `translateX(${translateX}%)`;
      this.track.style.width = `${(this.slides.length / this.options.slidesPerView) * 100}%`;

      if (this.pagination) {
        const dots = this.pagination.querySelectorAll('.carousel-pagination-dot');
        dots.forEach((dot, index) => {
          dot.classList.toggle('is-active', index === this.currentIndex);
        });
      }
    }

    next() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;

      const maxIndex = this.getSlideCount() - 1;
      if (this.currentIndex < maxIndex) {
        this.currentIndex++;
      } else if (this.options.loop) {
        this.currentIndex = 0;
      }

      this.update();
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
    }

    prev() {
      if (this.isTransitioning) return;
      this.isTransitioning = true;

      if (this.currentIndex > 0) {
        this.currentIndex--;
      } else if (this.options.loop) {
        this.currentIndex = this.getSlideCount() - 1;
      }

      this.update();
      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
    }

    goTo(index) {
      if (this.isTransitioning) return;
      this.isTransitioning = true;

      this.currentIndex = Math.max(0, Math.min(index, this.getSlideCount() - 1));
      this.update();

      setTimeout(() => {
        this.isTransitioning = false;
      }, 500);
    }

    startAutoplay() {
      this.stopAutoplay();
      this.autoplayTimer = setInterval(() => {
        this.next();
      }, this.options.autoplayDelay);
    }

    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    destroy() {
      this.stopAutoplay();
      if (this.pagination) this.pagination.remove();
      const navs = this.container.querySelectorAll('.carousel-nav');
      navs.forEach(nav => nav.remove());
    }
  }

  // Initialize carousels on page load
  function initCarousels() {
    // Featured Products Carousel
    const productsCarousel = document.querySelector('.featured-products-carousel.carousel-container');
    if (productsCarousel) {
      const slides = productsCarousel.querySelectorAll('.carousel-slide');
      if (slides.length > 0) {
        new Carousel(productsCarousel, {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: slides.length > 1,
          autoplay: slides.length > 1,
          autoplayDelay: 4000,
          navigation: true,
          pagination: true,
          breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 }
          }
        });
      }
    }

    // Bundles Slider
    const bundlesSlider = document.querySelector('.valentine-bundles-slider.carousel-container');
    if (bundlesSlider) {
      const slides = bundlesSlider.querySelectorAll('.carousel-slide');
      if (slides.length > 0) {
        new Carousel(bundlesSlider, {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: slides.length > 1,
          autoplay: slides.length > 1,
          autoplayDelay: 5000,
          navigation: true,
          pagination: true,
          breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }
        });
      }
    }

    // Testimonials Carousel
    const testimonialsCarousel = document.querySelector('.testimonials-carousel.carousel-container');
    if (testimonialsCarousel) {
      const slides = testimonialsCarousel.querySelectorAll('.carousel-slide');
      if (slides.length > 0) {
        new Carousel(testimonialsCarousel, {
          slidesPerView: 1,
          spaceBetween: 30,
          loop: slides.length > 1,
          autoplay: slides.length > 1,
          autoplayDelay: 6000,
          navigation: true,
          pagination: true,
          breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }
        });
      }
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousels);
  } else {
    initCarousels();
  }

  // Re-initialize on section load (Shopify theme editor)
  if (typeof Shopify !== 'undefined' && Shopify.designMode) {
    document.addEventListener('shopify:section:load', initCarousels);
  }

  // Export for global use
  window.Carousel = Carousel;
})();
