# Product Models Gutenberg Block Plugin

A powerful WordPress Gutenberg block for displaying product models with dynamic tabs, image galleries, and collapsible accordion sections.

## Features

### 1. Dynamic Tab System
- Add/remove unlimited tabs
- Customizable tab labels
- Drag-and-drop tab reordering
- Active tab indicator with bottom border
- Smooth tab switching without page reload

### 2. Product Management
- Add unlimited products per tab
- Assign products to specific tabs
- Drag-and-drop product reordering
- Duplicate products
- Delete products with confirmation

### 3. Image Gallery
- Multiple images per product
- Main image display with thumbnail navigation
- Previous/Next arrow navigation
- Click thumbnail to view
- Keyboard navigation support (arrow keys)
- Responsive design

### 4. Accordion Sections
- Multiple collapsible sections per product
- First section open by default
- Only one section open at a time
- Smooth expand/collapse animations
- Custom section titles
- Rich text descriptions
- Repeatable bullet points

### 5. Call-to-Action Button
- Customizable button text
- URL configuration
- Open in same/new window option
- Hover effects and animations

## Installation

1. Clone or download this repository into your WordPress plugins directory:
   ```bash
   cd wp-content/plugins/
   git clone <repository-url> product-models-block
   cd product-models-block
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the block:
   ```bash
   npm run build
   ```

4. Activate the plugin in WordPress admin panel (Plugins → Installed Plugins → Activate "Product Models Block")

## Development

### Start Development Mode
```bash
npm start
```
This will start the development server with hot reloading.

### Build for Production
```bash
npm run build
```

### Other Commands
```bash
npm run format      # Format code
npm run lint:js     # Lint JavaScript
npm run lint:css    # Lint CSS
npm run plugin-zip  # Create plugin zip file
```

## Usage

### Adding the Block

1. In the WordPress editor, click the (+) button to add a new block
2. Search for "Product Models"
3. Click to insert the block

### Configuring Tabs

1. Open the block settings panel on the right
2. Under "Tab Management":
   - Edit tab names
   - Use ↑/↓ buttons to reorder tabs
   - Click "Delete" to remove a tab
   - Click "+ Add New Tab" to create a new tab

### Adding Products

1. Select the tab where you want to add a product
2. In the settings panel, click "+ Add Product to Current Tab"
3. Configure the product:
   - Set product title
   - Assign to a tab
   - Add images
   - Configure accordion sections
   - Set up CTA button

### Managing Images

1. Click "Add Images" or "Edit Images"
2. Select multiple images from media library
3. Images will display with:
   - First image as main view
   - Thumbnails below for navigation
   - Arrow navigation for cycling through images

### Accordion Sections

1. Each product can have multiple accordion sections
2. First section is open by default on page load
3. Clicking a section opens it and closes others
4. Add bullet points within sections for features/specs
5. Use "+ Add Accordion Section" to add more sections

### CTA Button

1. Set button text (e.g., "Order Now", "Learn More")
2. Set destination URL
3. Choose to open in same window or new tab

## Block Structure

```
product-models-block/
├── product-models-block.php  # Main plugin file
├── src/
│   ├── block.json            # Block metadata
│   ├── index.js              # Block registration
│   ├── edit.js               # Editor component
│   ├── save.js               # Frontend render
│   ├── frontend.js           # Frontend interactions
│   ├── style.scss            # Frontend styles
│   └── editor.scss           # Editor styles
├── build/                    # Compiled files (generated)
├── package.json              # Dependencies
└── README.md                 # This file
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## WordPress Requirements

- WordPress 6.0 or higher
- PHP 7.4 or higher

## Customization

### Styling

The block uses BEM-style CSS classes for easy customization:

```css
.product-models-block           /* Main container */
.tab-navigation                 /* Tab container */
.tab-button                     /* Individual tab */
.tab-button.active              /* Active tab */
.product-item                   /* Product container */
.product-images                 /* Image section */
.main-image                     /* Main image display */
.thumbnail-images               /* Thumbnail container */
.product-details                /* Product info section */
.accordion-item                 /* Accordion container */
.accordion-header               /* Accordion toggle */
.accordion-content              /* Accordion body */
.cta-button                     /* Call-to-action button */
```

Add custom CSS in your theme's stylesheet to override default styles.

## Troubleshooting

### Block doesn't appear in editor
- Make sure plugin is activated
- Clear browser cache
- Check browser console for errors

### Images not displaying
- Verify image URLs are correct
- Check media library permissions
- Ensure images are properly uploaded

### Accordion not working
- Check browser console for JavaScript errors
- Ensure frontend.js is being loaded
- Clear cache and reload page

### Build errors
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (requires Node 14+)
- Run `npm run build` again

## License

GPL-2.0-or-later

## Support

For issues, questions, or contributions, please open an issue in the repository.

## Credits

Built with:
- WordPress Gutenberg
- React
- @wordpress/scripts
