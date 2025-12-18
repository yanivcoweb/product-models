/**
 * Frontend JavaScript for Product Models Block
 * Handles tab switching, accordion interactions, and image gallery navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all product model blocks on the page
    const blocks = document.querySelectorAll('.product-models-block');

    blocks.forEach(block => {
        initializeBlock(block);
    });
});

function initializeBlock(block) {
    // Tab switching
    initializeTabSwitching(block);

    // Accordion functionality
    initializeAccordions(block);

    // Image gallery navigation
    initializeImageGallery(block);
}

/**
 * Initialize tab switching functionality
 */
function initializeTabSwitching(block) {
    const tabButtons = block.querySelectorAll('.tab-button');
    const tabContents = block.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab-id');

            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            const activeContent = block.querySelector(`[data-tab-content="${tabId}"]`);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });
}

/**
 * Initialize accordion functionality
 * Logic: First accordion open by default, only one can be open at a time
 */
function initializeAccordions(block) {
    const products = block.querySelectorAll('.product-item');

    products.forEach(product => {
        const accordionItems = product.querySelectorAll('.accordion-item');

        accordionItems.forEach((item, index) => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');

            if (!header || !content || !icon) return;

            header.addEventListener('click', function(e) {
                e.preventDefault();

                const isActive = item.classList.contains('active');

                // Close all accordions in this product
                accordionItems.forEach(acc => {
                    acc.classList.remove('active');
                    const accContent = acc.querySelector('.accordion-content');
                    const accIcon = acc.querySelector('.accordion-icon');
                    const accHeader = acc.querySelector('.accordion-header');

                    if (accContent) {
                        accContent.style.display = 'none';
                    }
                    if (accIcon) {
                        accIcon.textContent = '+';
                    }
                    if (accHeader) {
                        accHeader.setAttribute('aria-expanded', 'false');
                    }
                });

                // If the clicked accordion was not active, open it
                if (!isActive) {
                    item.classList.add('active');
                    content.style.display = 'block';
                    icon.textContent = '−';
                    header.setAttribute('aria-expanded', 'true');
                }
                // If it was active, it stays closed (all sections collapsed)
            });
        });
    });
}

/**
 * Initialize image gallery navigation
 */
function initializeImageGallery(block) {
    const products = block.querySelectorAll('.product-item');

    products.forEach(product => {
        const mainImages = product.querySelectorAll('.main-image img');
        const thumbnails = product.querySelectorAll('.thumbnail-images img');
        const prevArrow = product.querySelector('.prev-arrow');
        const nextArrow = product.querySelector('.next-arrow');

        if (mainImages.length <= 1) {
            // Hide navigation arrows if there's only one image
            if (prevArrow) prevArrow.style.display = 'none';
            if (nextArrow) nextArrow.style.display = 'none';
            return;
        }

        let currentIndex = 0;

        // Function to show image at specific index
        function showImage(index) {
            // Hide all images
            mainImages.forEach(img => img.classList.remove('active'));
            thumbnails.forEach(thumb => thumb.classList.remove('active'));

            // Show selected image
            if (mainImages[index]) {
                mainImages[index].classList.add('active');
            }
            if (thumbnails[index]) {
                thumbnails[index].classList.add('active');
            }

            currentIndex = index;
        }

        // Thumbnail click handlers
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                showImage(index);
            });
        });

        // Previous arrow
        if (prevArrow) {
            prevArrow.addEventListener('click', function() {
                const newIndex = currentIndex > 0 ? currentIndex - 1 : mainImages.length - 1;
                showImage(newIndex);
            });
        }

        // Next arrow
        if (nextArrow) {
            nextArrow.addEventListener('click', function() {
                const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
                showImage(newIndex);
            });
        }

        // Keyboard navigation
        product.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                const newIndex = currentIndex > 0 ? currentIndex - 1 : mainImages.length - 1;
                showImage(newIndex);
            } else if (e.key === 'ArrowRight') {
                const newIndex = currentIndex < mainImages.length - 1 ? currentIndex + 1 : 0;
                showImage(newIndex);
            }
        });
    });
}
