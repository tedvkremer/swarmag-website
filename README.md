# swarmAg Website Architecture

## Overview

The swarmAg website is a modern, single-page web application built for a North Texas ag services company. The application showcases drone spraying/spreading services and mesquite & brush mitigation treatments, featuring interactive photo galleries, contact forms, and an engaging bee swarm animation system.

## Technology Stack

### Frontend Framework
- **Vanilla JavaScript (ES6+)** - No framework dependencies for maximum performance and control
- **HTML5** - Semantic markup with accessibility features and structured data
- **CSS3** - Custom design system with fluid typography, responsive layouts, and advanced animations

### Build Tools & Dependencies
- **EmailJS** - Client-side email service for contact form submissions
- **Local Font Hosting** - Self-hosted Inter and Playfair Display fonts for optimal performance
- **Normalize.css** - CSS reset for consistent cross-browser rendering

## Project Structure

```
swarmag-website/
├── README.md                 # Project architecture documentation
├── index.html                # Main HTML document with semantic structure
├── styles/                   # CSS stylesheets and design system
│   ├── normalize.css           # Cross-browser CSS reset
│   ├── Carousel.css            # Carousel component styles
│   └── index.css               # Main stylesheet with design tokens
├── modules/                  # JavaScript modules
│   ├── Website.js              # Main application singleton & orchestration
│   ├── Swarm.js                # Bee swarm animation system (Bee class)
│   ├── Carousel.js             # Photo carousel component
│   ├── PhotoCatalog.js         # Immutable gallery data management
│   ├── page-contact.js         # Contact form initialization & EmailJS integration
│   ├── page-dynamics.js        # Scroll animations & intersection observer effects
│   ├── page-errors.js          # Error handling & logging utilities
│   ├── page-galleries.js       # Gallery setup & carousel integration
│   └── utils.js                # Utility functions ($/$$, immutable, shuffle)
├── assets/                   # Static assets (optimized & self-hosted)
│   ├── hero.mp4                # Hero background video
│   ├── swarmag-logo-*.png      # Logo variants (tree, wordmark)
│   ├── clipart-*.png           # Service illustrations (drones, mesquite, skidsteer)
│   ├── apple-touch-icon*.png   # PWA touch icons (57x57 to 180x180)
│   └── *.ttf                   # Self-hosted fonts (Inter, Playfair Display)
├── galleries/                # Photo gallery organized by service type
    ├── aerial/                 # Aerial drone photos 
    │   └── g1-photo-*.jpg
    └── ground/                 # Ground machinery photos
        └── g2-photo-*.jpg
```

## Architecture Patterns

### Singleton Pattern
The `Website` class implements a singleton pattern to ensure only one application instance exists throughout the lifecycle:

```javascript
export default class Website {
  static #the = null;

  static get the() {
    if (!Website.#the) throw new Error('bootstrap() must be completed first!');
    return Website.#the;
  }

  static bootstrap(modules = []) {
    if (Website.#the) throw new Error("bootstrap() already completed!");
    Website.#the = new Website();
    // ... initialization logic
  }
}
```

### Module Pattern
The application uses ES6 modules with clear separation of concerns:
- **Website.js** - Application orchestration and singleton management
- **page-*.js** - Feature-specific initialization modules
- **utils.js** - Shared utility functions and DOM helpers

### Component Pattern
Interactive components like `Carousel` and `Swarm` are self-contained classes with their own state management, DOM manipulation, and lifecycle methods.

## Core Components

### Website (Main Application)
**Purpose**: Application bootstrap and module orchestration

**Key Responsibilities:**
- Initialize all page modules dynamically
- Manage gallery collections and references
- Coordinate swarm animation system
- Provide singleton access pattern

**Technical Details:**
- Uses DOMContentLoaded event for initialization
- Dynamic module loading with error handling
- Manages application state and references

### Swarm Animation System
**Purpose**: Interactive bee swarm visual effect using flocking algorithms

**Features:**
- Craig Reynolds' boid algorithm implementation
- Mouse/touch interaction for swarm targeting
- Automatic scatter/home cycling with screen-size adaptive timing
- Hardware-accelerated CSS transforms

**Technical Details:**
- RequestAnimationFrame for smooth 60fps animation
- Flocking behaviors: separation, alignment, cohesion
- Boundary wrapping for seamless movement
- Screen size-based duration calculation using linear interpolation

### Carousel Component
**Purpose**: Photo gallery slideshow with accessibility features

**Features:**
- Manual navigation (prev/next buttons)
- Indicator dots for direct slide access
- Auto-play with configurable timing
- Full keyboard and screen reader support

**Technical Details:**
- CSS transforms for smooth transitions
- Event delegation for indicator interactions
- Circular navigation with bounds checking
- ARIA labels and roles for accessibility

### Photo Catalog
**Purpose**: Immutable gallery data management with randomization

**Features:**
- Predefined gallery collections by service type
- Random shuffling for dynamic presentation
- Immutable data structures for safety

**Technical Details:**
- Frozen objects prevent accidental mutation
- Shuffle utility with configurable subset selection
- Path-based photo organization

## Design System

### Typography Scale
- **Primary Font**: Inter (sans-serif) - Body text, UI elements, data
- **Heading Font**: Playfair Display (serif) - Headlines, branding, emphasis
- **Monospace**: System fonts - Code snippets, service SKUs
- **Fluid Typography**: Clamp functions for responsive scaling

### Color Palette
```css
:root {
  /* Fundamental Colors */
  --sa-color-dark: #57534e;      /* Primary text, borders */
  --sa-color-white: #fafafa;     /* Background variations */
  --sa-color-bright: #ffffff;    /* Pure white */

  /* Brand Colors */
  --sa-color-green: #95ac63;     /* Nature, success, brand accent */
  --sa-color-orange: #dcab4f;    /* Action, warning, secondary accent */

  /* Background Variations */
  --sa-color-eggshell: #fff3df;  /* Warm light background */
  --sa-color-mint: #f0fdf4;      /* Cool light background */
  --sa-color-sky: #cdeaff;       /* Blue accent background */

  /* UI Colors */
  --sa-color-border: #e5e7eb;    /* Input borders */
  --sa-color-placeholder: #9ca3af; /* Placeholder text */

  /* Footer Colors */
  --sa-color-footer-border: #36302e;
  --sa-color-footer-bg: #1c1917;
  --sa-color-footer-text: #a8a29e;
}
```

### Layout System
- **Container Queries**: Responsive layouts adapt to content width
- **CSS Grid**: Two-column layouts for content sections
- **Flexbox**: Component-level layouts and alignments
- **Fluid Spacing**: Clamp functions for responsive margins/padding

### Animation & Effects
- **Fade-in-up**: Scroll-triggered animations using Intersection Observer
- **Hover Effects**: Button interactions with transform and shadow changes
- **Swarm Animation**: Complex particle system with flocking behaviors
- **CSS Transitions**: Smooth state changes with easing functions

## Performance Optimizations

### Font Loading Strategy
- **Self-hosted fonts** instead of Google Fonts (reduced external requests)
- **Font preloading** in HTML head for immediate availability
- **Font-display: swap** for immediate text rendering
- **WOFF2 format** for optimal compression

### Image Optimization
- **Lazy loading** for gallery images with loading states
- **Progressive JPEG** format for photos
- **Responsive images** with appropriate sizing
- **WebP/AVIF** potential for modern browsers

### JavaScript Optimization
- **ES6 modules** with tree shaking potential
- **Minimal dependencies** (only EmailJS for forms)
- **Efficient DOM queries** with cached selectors
- **Event delegation** for dynamic content

### CSS Optimization
- **Utility-first approach** with Tailwind for smaller bundle size
- **CSS custom properties** for theming and consistency
- **Hardware acceleration** with transform3d and will-change
- **Critical CSS inlining** potential

## Accessibility Features

### Semantic HTML
- Proper heading hierarchy (h1-h3) for screen readers
- Semantic landmarks (header, main, footer)
- Structured data with JSON-LD schema markup
- ARIA labels and roles throughout

### Keyboard Navigation
- Focus management for interactive elements
- Keyboard-accessible carousels and forms
- Skip links for screen readers
- Logical tab order

### Motion Preferences
- `prefers-reduced-motion` media query support
- Respects user motion preferences
- Graceful degradation for animation preferences

### Color & Contrast
- WCAG AA compliant color ratios
- Sufficient contrast for text readability
- Focus indicators with high contrast
- Color-independent navigation

## Development Workflow

### Module Loading
The application uses a bootstrap pattern with dynamic ES6 module loading:

```javascript
// index.html
<script type="module">
  import Website from "./modules/Website.js";
  Website.bootstrap([
    "page-errors",
    "page-dynamics",
    "page-galleries",
    "page-contact",
  ]);
</script>
```

### Error Handling
- Try-catch blocks in critical paths
- Graceful degradation for failed module loads
- Console error logging for debugging
- User-friendly error states

### Build Process
- **No build step required** - Direct ES6 module loading in modern browsers
- **Development server** can serve modules directly
- **Production ready** with HTTP/2 module serving
- **Hot reloading** support in development

## Browser Support

### Target Browsers
- **Modern browsers** with ES6 module support (Chrome 61+, Firefox 60+, Safari 10.1+)
- **Progressive enhancement** for older browsers
- **Mobile-first responsive design**

### Feature Detection
- CSS feature queries for advanced layouts
- JavaScript feature detection for optional enhancements
- Graceful fallbacks for unsupported features

## Deployment Considerations

### Hosting Requirements
- **HTTPS required** for ES6 module loading
- **HTTP/2 recommended** for multiple module requests
- **CDN optional** for asset delivery

### Performance Monitoring
- **Core Web Vitals** tracking recommended
- **Lighthouse audits** for ongoing optimization
- **Real User Monitoring** for performance insights

### SEO & Discovery
- **Structured data** with Schema.org markup
- **Meta tags** for social sharing and search engines
- **Canonical URLs** for duplicate content prevention
- **XML sitemap** potential

## Content Management

### Gallery System
- **Organized by service type** (aerial, ground)
- **Randomized display** for dynamic user experience
- **Lazy loading** for performance
- **Accessibility compliant** image presentation

### Service Catalog
- **Structured data format** for services and equipment
- **SKU-based organization** for inventory management
- **Responsive table design** for mobile compatibility

## Future Enhancements

### Potential Improvements
- **Service Worker** for offline functionality and caching
- **Web Components** for reusable UI elements
- **CSS custom properties** expansion for advanced theming
- **Animation performance** optimizations with Web Animations API

### Scalability Considerations
- **Component library** extraction for reuse across projects
- **State management** for complex interactions
- **Testing framework** integration (Jest, Cypress)
- **Build optimization** for larger applications

### Analytics & Monitoring
- **Google Analytics** integration for user behavior tracking
- **Error tracking** with Sentry or similar services
- **Performance monitoring** with Web Vitals

## Conclusion

The swarmAg website demonstrates a modern, performance-focused approach to web development using vanilla JavaScript and CSS. The architecture emphasizes modularity, accessibility, and user experience while maintaining clean, maintainable code. The bee swarm animation adds a unique interactive element that showcases advanced JavaScript capabilities for visual effects.

The project serves as an excellent example of contemporary web development practices, balancing technical excellence with business requirements for a North Texas agricultural services company.
