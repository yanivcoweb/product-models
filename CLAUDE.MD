# CLAUDE.MD - Product Models Block Plugin

## Project Overview

This is a WordPress Gutenberg block plugin that displays product models with dynamic tabs, image galleries, and collapsible accordion sections. It provides a rich, interactive product showcase experience for WordPress sites.

**Plugin Name:** Product Models Block
**Version:** 1.0.0
**WordPress Version:** 6.0+
**PHP Version:** 7.4+
**License:** GPL-2.0-or-later

## Architecture

### Technology Stack
- **Frontend Framework:** React (via WordPress Gutenberg)
- **Build Tool:** @wordpress/scripts (webpack-based)
- **Styling:** SCSS
- **Backend:** PHP (WordPress plugin API)

### File Structure

```
product-models-block/
├── product-models-block.php  # Main plugin file - registers block and enqueues assets
├── src/
│   ├── block.json            # Block metadata and attribute definitions
│   ├── index.js              # Block registration entry point
│   ├── edit.js               # Editor component (React) - 26KB, complex UI
│   ├── save.js               # Frontend render function (React) - 8.5KB
│   ├── frontend.js           # Client-side interactions (vanilla JS) - 6.3KB
│   ├── style.scss            # Frontend styles - 7.5KB
│   └── editor.scss           # Editor-specific styles - 1.3KB
├── build/                    # Compiled/transpiled files (git-ignored)
├── node_modules/             # Dependencies (git-ignored)
├── package.json              # NPM dependencies and scripts
├── webpack.config.js         # Custom webpack configuration
└── README.md                 # User documentation
```

## Core Features

### 1. Tab System
- Dynamic tab creation/deletion/reordering
- Each tab can contain multiple products
- Active tab state management
- Smooth tab switching

### 2. Product Management
- Unlimited products per tab
- Drag-and-drop reordering
- Product duplication
- Per-product configuration:
  - Title
  - Tab assignment
  - Image gallery
  - Accordion sections
  - CTA button

### 3. Image Gallery
- Multi-image support per product
- Main image display with thumbnail navigation
- Arrow key navigation
- Previous/Next controls
- First image shown by default

### 4. Accordion Sections
- Multiple collapsible sections per product
- First section open by default
- One section open at a time
- Custom section titles
- Rich text descriptions
- Repeatable bullet points

### 5. Call-to-Action Button
- Customizable text and URL
- Target window configuration (same/new)
- Hover effects

## Key Components

### edit.js (src/edit.js:1)
The main editor component with:
- `Edit` component - Main block editor interface
- Tab management UI (add, edit, delete, reorder)
- Product management controls
- Settings panel with InspectorControls
- Image gallery manager
- Accordion section builder
- Real-time preview

**Key State:**
- `tabs` - Array of tab objects
- `products` - Array of product objects with images, accordions, CTA
- `activeTab` - Currently selected tab index

### save.js (src/save.js:1)
Renders the static HTML output:
- Tab navigation structure
- Product containers
- Image gallery markup
- Accordion sections
- CTA buttons
- Data attributes for frontend JS

### frontend.js (src/frontend.js:1)
Handles client-side interactions:
- Tab switching logic
- Image gallery navigation
- Accordion expand/collapse
- Keyboard event handlers
- DOM manipulation for interactivity

**Runs on:** `DOMContentLoaded` event

### block.json (src/block.json:1)
Defines:
- Block metadata (name, title, category, icon)
- Block attributes schema
- Script/style dependencies
- Editor and frontend assets

## Data Model

### Attributes Structure

```javascript
{
  tabs: [
    {
      id: string,
      label: string
    }
  ],
  products: [
    {
      id: string,
      title: string,
      tabId: string,
      images: [
        {
          id: number,
          url: string,
          alt: string
        }
      ],
      accordions: [
        {
          id: string,
          title: string,
          description: string,
          bullets: [
            {
              id: string,
              text: string
            }
          ]
        }
      ],
      ctaText: string,
      ctaUrl: string,
      ctaTarget: string ('_self' | '_blank')
    }
  ],
  activeTab: number
}
```

## Build & Development

### NPM Scripts
```bash
npm start         # Development mode with hot reload
npm run build     # Production build
npm run format    # Code formatting
npm run lint:js   # JavaScript linting
npm run lint:css  # CSS linting
npm run plugin-zip # Create distributable zip
```

### Build Output
Webpack compiles to `build/` directory:
- `index.js` - Main block bundle
- `frontend.js` - Frontend interactions
- `index.css` - Combined styles
- `index.asset.php` - Dependency manifest

## WordPress Integration

### Plugin Registration
**File:** product-models-block.php:21
- `product_models_block_init()` - Registers block type from build directory
- Hooked to `init` action

### Asset Enqueuing
**File:** product-models-block.php:29
- `product_models_block_enqueue_frontend_assets()` - Conditionally enqueues frontend.js
- Only loads when block is present on page
- Uses file modification time for cache busting
- Hooked to `wp_enqueue_scripts` action

### Block Namespace
**Identifier:** `create-block/product-models-block`

## Development Guidelines

### When Modifying This Plugin

1. **Editing Block Behavior:**
   - Edit `src/edit.js` for editor interface changes
   - Edit `src/save.js` for frontend HTML structure
   - Edit `src/frontend.js` for interactive behaviors
   - Always run `npm run build` after changes

2. **Adding New Attributes:**
   - Update `src/block.json` with new attribute definitions
   - Update `src/edit.js` to handle the attribute in editor
   - Update `src/save.js` to render the attribute
   - Consider backward compatibility

3. **Styling Changes:**
   - Edit `src/style.scss` for frontend styles (both editor and frontend)
   - Edit `src/editor.scss` for editor-only styles
   - Use BEM methodology for class names
   - Rebuild to regenerate CSS

4. **Testing:**
   - Test in WordPress editor (Gutenberg)
   - Test on frontend (published page)
   - Test responsive behavior
   - Test keyboard navigation
   - Test with multiple instances of the block
   - Clear cache after building

### Code Patterns

**BEM CSS Classes:**
```
.product-models-block
.tab-navigation
.tab-button
.tab-button.active
.product-item
.product-images
.main-image
.thumbnail-images
.product-details
.accordion-item
.accordion-header
.accordion-content
.cta-button
```

**React Patterns:**
- Functional components with hooks
- WordPress components (@wordpress/components)
- Block editor components (@wordpress/block-editor)
- Immutable state updates

**Frontend JS:**
- Vanilla JavaScript (no framework)
- Event delegation
- Data attributes for state
- Progressive enhancement

## Common Tasks

### Adding a New Tab
1. User clicks "+ Add New Tab" in editor
2. New tab object added to `tabs` array
3. `activeTab` updated to new tab index
4. Component re-renders with new tab

### Adding a Product
1. User clicks "+ Add Product to Current Tab"
2. New product object created with `tabId` = current active tab
3. Product added to `products` array
4. Settings panel shows product configuration

### Image Gallery Interaction
1. User clicks thumbnail or arrow
2. `frontend.js` updates main image `src`
3. Active thumbnail class updates
4. Keyboard navigation via arrow keys

### Accordion Interaction
1. User clicks accordion header
2. `frontend.js` checks if section is open
3. Closes all sections in product
4. Opens clicked section
5. CSS transition animates height

## Dependencies

### WordPress Packages
- `@wordpress/blocks` - Block registration API
- `@wordpress/block-editor` - Block editor components
- `@wordpress/components` - UI components
- `@wordpress/element` - React abstraction
- `@wordpress/i18n` - Internationalization

### Dev Dependencies
- `@wordpress/scripts` - Build tooling (webpack, babel, etc.)

## Troubleshooting

### Block Not Appearing
- Check plugin activation status
- Verify build directory exists and has files
- Check browser console for JS errors
- Clear WordPress object cache

### Build Errors
- Delete `node_modules/` and run `npm install`
- Check Node.js version (14+ required)
- Verify `@wordpress/scripts` is installed

### Frontend Not Working
- Ensure `frontend.js` is enqueued (check page source)
- Check browser console for errors
- Verify block is present: `has_block('create-block/product-models-block')`
- Clear browser cache

### Styles Not Applying
- Run `npm run build` to regenerate CSS
- Check that `build/index.css` exists
- Clear WordPress cache
- Check for CSS specificity conflicts

## Git Information

**Current Branch:** claude/product-models-gutenberg-block-MJbNY
**Status:** Initial commit completed

### Ignored Files
- `/node_modules/`
- `/build/`
- `/vendor/`
- `*.zip`
- `package-lock.json` (currently untracked)

## Future Enhancement Ideas

- Product search/filter functionality
- Animation options for accordions
- Custom color scheme options
- Product sorting/filtering on frontend
- Export/import product data
- Product templates/presets
- Analytics integration
- SEO metadata support
- Schema.org markup for products
- Lazy loading for images
- Accessibility improvements (ARIA labels)
- RTL language support

## Notes for Claude

- This is a standard WordPress Gutenberg block plugin
- Uses modern React patterns via WordPress abstractions
- Build process is handled by @wordpress/scripts (no custom webpack needed mostly)
- Frontend interactivity separated from React (frontend.js)
- Block attributes stored in WordPress post content as HTML comments
- Always rebuild after source changes: `npm run build`
- Test changes in both editor and frontend contexts
- WordPress coding standards apply to PHP files
- Block namespace uses create-block prefix (can be changed if needed)
