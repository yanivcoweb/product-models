import { __ } from '@wordpress/i18n';
import {
    useBlockProps,
    InspectorControls,
    MediaUpload,
    MediaUploadCheck,
    RichText,
} from '@wordpress/block-editor';
import {
    PanelBody,
    Button,
    TextControl,
    SelectControl,
    IconButton,
    Tooltip,
    Placeholder,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
    const { tabs, activeTab, products } = attributes;
    const [activeEditorTab, setActiveEditorTab] = useState(activeTab);
    const [expandedProduct, setExpandedProduct] = useState(null);
    const [expandedAccordion, setExpandedAccordion] = useState({});

    // Helper function to generate slug from name
    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    // Add new tab
    const addTab = () => {
        const newTabName = `Tab ${tabs.length + 1}`;
        const newTab = {
            id: `tab-${Date.now()}`,
            name: newTabName,
            slug: generateSlug(newTabName),
        };
        setAttributes({ tabs: [...tabs, newTab] });
    };

    // Update tab name
    const updateTabName = (index, newName) => {
        const newTabs = [...tabs];
        newTabs[index] = {
            ...newTabs[index],
            name: newName,
            slug: generateSlug(newName),
        };
        setAttributes({ tabs: newTabs });
    };

    // Delete tab
    const deleteTab = (index) => {
        if (tabs.length === 1) {
            alert(__('You must have at least one tab.', 'product-models-block'));
            return;
        }

        const tabToDelete = tabs[index];
        const productsInTab = products.filter(p => p.tabId === tabToDelete.id);

        if (productsInTab.length > 0) {
            if (!confirm(__(`This tab contains ${productsInTab.length} product(s). Are you sure you want to delete it?`, 'product-models-block'))) {
                return;
            }
        }

        const newTabs = tabs.filter((_, i) => i !== index);
        const newProducts = products.filter(p => p.tabId !== tabToDelete.id);

        setAttributes({
            tabs: newTabs,
            products: newProducts,
            activeTab: newTabs[0].id
        });
        setActiveEditorTab(newTabs[0].id);
    };

    // Reorder tabs
    const moveTab = (fromIndex, toIndex) => {
        const newTabs = [...tabs];
        const [movedTab] = newTabs.splice(fromIndex, 1);
        newTabs.splice(toIndex, 0, movedTab);
        setAttributes({ tabs: newTabs });
    };

    // Add new product
    const addProduct = () => {
        const newProduct = {
            id: `product-${Date.now()}`,
            tabId: activeEditorTab,
            title: __('New Product', 'product-models-block'),
            images: [],
            accordions: [
                {
                    id: `accordion-${Date.now()}`,
                    title: __('Features', 'product-models-block'),
                    content: '',
                    bulletPoints: [],
                }
            ],
            ctaText: __('Order Now', 'product-models-block'),
            ctaUrl: '#',
            ctaTarget: '_self',
        };
        setAttributes({ products: [...products, newProduct] });
        setExpandedProduct(newProduct.id);
    };

    // Update product
    const updateProduct = (productId, updates) => {
        const newProducts = products.map(p =>
            p.id === productId ? { ...p, ...updates } : p
        );
        setAttributes({ products: newProducts });
    };

    // Delete product
    const deleteProduct = (productId) => {
        if (confirm(__('Are you sure you want to delete this product?', 'product-models-block'))) {
            setAttributes({
                products: products.filter(p => p.id !== productId)
            });
        }
    };

    // Duplicate product
    const duplicateProduct = (productId) => {
        const productToDuplicate = products.find(p => p.id === productId);
        if (productToDuplicate) {
            const newProduct = {
                ...productToDuplicate,
                id: `product-${Date.now()}`,
                title: `${productToDuplicate.title} (Copy)`,
            };
            setAttributes({ products: [...products, newProduct] });
        }
    };

    // Move product
    const moveProduct = (productId, direction) => {
        const currentTabProducts = products.filter(p => p.tabId === activeEditorTab);
        const productIndex = currentTabProducts.findIndex(p => p.id === productId);

        if (
            (direction === 'up' && productIndex === 0) ||
            (direction === 'down' && productIndex === currentTabProducts.length - 1)
        ) {
            return;
        }

        const newIndex = direction === 'up' ? productIndex - 1 : productIndex + 1;
        const allProducts = [...products];
        const currentProduct = currentTabProducts[productIndex];
        const swapProduct = currentTabProducts[newIndex];

        const currentProductIndex = allProducts.findIndex(p => p.id === currentProduct.id);
        const swapProductIndex = allProducts.findIndex(p => p.id === swapProduct.id);

        [allProducts[currentProductIndex], allProducts[swapProductIndex]] =
        [allProducts[swapProductIndex], allProducts[currentProductIndex]];

        setAttributes({ products: allProducts });
    };

    // Add accordion section
    const addAccordion = (productId) => {
        const newAccordion = {
            id: `accordion-${Date.now()}`,
            title: __('New Section', 'product-models-block'),
            content: '',
            bulletPoints: [],
        };

        updateProduct(productId, {
            accordions: [...products.find(p => p.id === productId).accordions, newAccordion]
        });
    };

    // Update accordion
    const updateAccordion = (productId, accordionId, updates) => {
        const product = products.find(p => p.id === productId);
        const newAccordions = product.accordions.map(a =>
            a.id === accordionId ? { ...a, ...updates } : a
        );
        updateProduct(productId, { accordions: newAccordions });
    };

    // Delete accordion
    const deleteAccordion = (productId, accordionId) => {
        const product = products.find(p => p.id === productId);
        if (product.accordions.length === 1) {
            alert(__('Product must have at least one accordion section.', 'product-models-block'));
            return;
        }

        const newAccordions = product.accordions.filter(a => a.id !== accordionId);
        updateProduct(productId, { accordions: newAccordions });
    };

    // Add bullet point
    const addBulletPoint = (productId, accordionId) => {
        const product = products.find(p => p.id === productId);
        const accordion = product.accordions.find(a => a.id === accordionId);
        const newBulletPoints = [...accordion.bulletPoints, ''];
        updateAccordion(productId, accordionId, { bulletPoints: newBulletPoints });
    };

    // Update bullet point
    const updateBulletPoint = (productId, accordionId, bulletIndex, value) => {
        const product = products.find(p => p.id === productId);
        const accordion = product.accordions.find(a => a.id === accordionId);
        const newBulletPoints = [...accordion.bulletPoints];
        newBulletPoints[bulletIndex] = value;
        updateAccordion(productId, accordionId, { bulletPoints: newBulletPoints });
    };

    // Delete bullet point
    const deleteBulletPoint = (productId, accordionId, bulletIndex) => {
        const product = products.find(p => p.id === productId);
        const accordion = product.accordions.find(a => a.id === accordionId);
        const newBulletPoints = accordion.bulletPoints.filter((_, i) => i !== bulletIndex);
        updateAccordion(productId, accordionId, { bulletPoints: newBulletPoints });
    };

    // Toggle accordion in editor
    const toggleAccordion = (productId, accordionId) => {
        const key = `${productId}-${accordionId}`;
        setExpandedAccordion(prev => ({
            ...prev,
            [productId]: prev[productId] === accordionId ? null : accordionId
        }));
    };

    // Get products for current tab
    const currentTabProducts = products.filter(p => p.tabId === activeEditorTab);

    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Tab Management', 'product-models-block')} initialOpen={true}>
                    {tabs.map((tab, index) => (
                        <div key={tab.id} className="tab-control">
                            <TextControl
                                label={__(`Tab ${index + 1} Name`, 'product-models-block')}
                                value={tab.name}
                                onChange={(value) => updateTabName(index, value)}
                            />
                            <div className="tab-control-actions">
                                {index > 0 && (
                                    <Button
                                        isSmall
                                        onClick={() => moveTab(index, index - 1)}
                                    >
                                        ↑
                                    </Button>
                                )}
                                {index < tabs.length - 1 && (
                                    <Button
                                        isSmall
                                        onClick={() => moveTab(index, index + 1)}
                                    >
                                        ↓
                                    </Button>
                                )}
                                <Button
                                    isDestructive
                                    isSmall
                                    onClick={() => deleteTab(index)}
                                    disabled={tabs.length === 1}
                                >
                                    {__('Delete', 'product-models-block')}
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button
                        isPrimary
                        onClick={addTab}
                    >
                        {__('+ Add New Tab', 'product-models-block')}
                    </Button>
                </PanelBody>

                {currentTabProducts.map((product) => (
                    <PanelBody
                        key={product.id}
                        title={product.title}
                        initialOpen={expandedProduct === product.id}
                        onToggle={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                    >
                        <TextControl
                            label={__('Product Title', 'product-models-block')}
                            value={product.title}
                            onChange={(value) => updateProduct(product.id, { title: value })}
                        />

                        <SelectControl
                            label={__('Assign to Tab', 'product-models-block')}
                            value={product.tabId}
                            options={tabs.map(tab => ({
                                label: tab.name,
                                value: tab.id,
                            }))}
                            onChange={(value) => updateProduct(product.id, { tabId: value })}
                        />

                        <h4>{__('Images', 'product-models-block')}</h4>
                        <MediaUploadCheck>
                            <MediaUpload
                                multiple
                                gallery
                                onSelect={(media) => {
                                    const images = media.map(img => ({
                                        id: img.id,
                                        url: img.url,
                                        alt: img.alt || '',
                                    }));
                                    updateProduct(product.id, { images });
                                }}
                                allowedTypes={['image']}
                                value={product.images.map(img => img.id)}
                                render={({ open }) => (
                                    <Button onClick={open} isPrimary>
                                        {product.images.length === 0
                                            ? __('Add Images', 'product-models-block')
                                            : __('Edit Images', 'product-models-block')}
                                    </Button>
                                )}
                            />
                        </MediaUploadCheck>

                        {product.images.length > 0 && (
                            <div className="product-images-preview">
                                {product.images.map((img, idx) => (
                                    <img key={idx} src={img.url} alt={img.alt} style={{ width: '50px', height: '50px', objectFit: 'cover', margin: '5px' }} />
                                ))}
                            </div>
                        )}

                        <h4>{__('Accordion Sections', 'product-models-block')}</h4>
                        {product.accordions.map((accordion, accIndex) => (
                            <div key={accordion.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd' }}>
                                <TextControl
                                    label={__(`Section ${accIndex + 1} Title`, 'product-models-block')}
                                    value={accordion.title}
                                    onChange={(value) => updateAccordion(product.id, accordion.id, { title: value })}
                                />

                                <TextControl
                                    label={__('Description', 'product-models-block')}
                                    value={accordion.content}
                                    onChange={(value) => updateAccordion(product.id, accordion.id, { content: value })}
                                />

                                <h5>{__('Bullet Points', 'product-models-block')}</h5>
                                {accordion.bulletPoints.map((bullet, bulletIdx) => (
                                    <div key={bulletIdx} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                        <TextControl
                                            value={bullet}
                                            onChange={(value) => updateBulletPoint(product.id, accordion.id, bulletIdx, value)}
                                            style={{ flex: 1 }}
                                        />
                                        <Button
                                            isDestructive
                                            isSmall
                                            onClick={() => deleteBulletPoint(product.id, accordion.id, bulletIdx)}
                                        >
                                            ✕
                                        </Button>
                                    </div>
                                ))}
                                <Button
                                    isSecondary
                                    isSmall
                                    onClick={() => addBulletPoint(product.id, accordion.id)}
                                >
                                    {__('+ Add Bullet Point', 'product-models-block')}
                                </Button>

                                {product.accordions.length > 1 && (
                                    <Button
                                        isDestructive
                                        isSmall
                                        onClick={() => deleteAccordion(product.id, accordion.id)}
                                        style={{ marginTop: '10px' }}
                                    >
                                        {__('Delete Section', 'product-models-block')}
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            isSecondary
                            onClick={() => addAccordion(product.id)}
                        >
                            {__('+ Add Accordion Section', 'product-models-block')}
                        </Button>

                        <h4>{__('Call-to-Action Button', 'product-models-block')}</h4>
                        <TextControl
                            label={__('Button Text', 'product-models-block')}
                            value={product.ctaText}
                            onChange={(value) => updateProduct(product.id, { ctaText: value })}
                        />
                        <TextControl
                            label={__('Button URL', 'product-models-block')}
                            value={product.ctaUrl}
                            onChange={(value) => updateProduct(product.id, { ctaUrl: value })}
                        />
                        <SelectControl
                            label={__('Open in', 'product-models-block')}
                            value={product.ctaTarget}
                            options={[
                                { label: __('Same window', 'product-models-block'), value: '_self' },
                                { label: __('New window', 'product-models-block'), value: '_blank' },
                            ]}
                            onChange={(value) => updateProduct(product.id, { ctaTarget: value })}
                        />

                        <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                            <Button
                                isSecondary
                                onClick={() => duplicateProduct(product.id)}
                            >
                                {__('Duplicate', 'product-models-block')}
                            </Button>
                            <Button
                                isDestructive
                                onClick={() => deleteProduct(product.id)}
                            >
                                {__('Delete Product', 'product-models-block')}
                            </Button>
                        </div>

                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                            <Button
                                isSmall
                                onClick={() => moveProduct(product.id, 'up')}
                                disabled={currentTabProducts.indexOf(product) === 0}
                            >
                                ↑ {__('Move Up', 'product-models-block')}
                            </Button>
                            <Button
                                isSmall
                                onClick={() => moveProduct(product.id, 'down')}
                                disabled={currentTabProducts.indexOf(product) === currentTabProducts.length - 1}
                            >
                                ↓ {__('Move Down', 'product-models-block')}
                            </Button>
                        </div>
                    </PanelBody>
                ))}

                <PanelBody title={__('Add New Product', 'product-models-block')}>
                    <Button
                        isPrimary
                        onClick={addProduct}
                    >
                        {__('+ Add Product to Current Tab', 'product-models-block')}
                    </Button>
                </PanelBody>
            </InspectorControls>

            <div {...useBlockProps()}>
                <div className="product-models-block">
                    {/* Tab Navigation */}
                    <div className="tab-navigation">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-button ${activeEditorTab === tab.id ? 'active' : ''}`}
                                onClick={() => setActiveEditorTab(tab.id)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Products */}
                    <div className="products-container">
                        {currentTabProducts.length === 0 ? (
                            <Placeholder
                                label={__('No products yet', 'product-models-block')}
                                instructions={__('Add products using the inspector controls on the right.', 'product-models-block')}
                            />
                        ) : (
                            currentTabProducts.map((product) => (
                                <div key={product.id} className="product-item">
                                    <div className="product-images">
                                        {product.images.length > 0 ? (
                                            <>
                                                <div className="main-image">
                                                    <img src={product.images[0].url} alt={product.images[0].alt} />
                                                </div>
                                                {product.images.length > 1 && (
                                                    <div className="thumbnail-images">
                                                        {product.images.map((img, idx) => (
                                                            <img key={idx} src={img.url} alt={img.alt} />
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="no-image-placeholder">
                                                {__('No images', 'product-models-block')}
                                            </div>
                                        )}
                                    </div>

                                    <div className="product-details">
                                        <h2 className="product-title">{product.title}</h2>

                                        <div className="accordions">
                                            {product.accordions.map((accordion, index) => (
                                                <div key={accordion.id} className="accordion-item">
                                                    <button
                                                        className="accordion-header"
                                                        onClick={() => toggleAccordion(product.id, accordion.id)}
                                                    >
                                                        <span>{accordion.title}</span>
                                                        <span className="accordion-icon">
                                                            {expandedAccordion[product.id] === accordion.id ? '−' : '+'}
                                                        </span>
                                                    </button>
                                                    {expandedAccordion[product.id] === accordion.id && (
                                                        <div className="accordion-content">
                                                            {accordion.content && <p>{accordion.content}</p>}
                                                            {accordion.bulletPoints.length > 0 && (
                                                                <ul>
                                                                    {accordion.bulletPoints.map((bullet, idx) => (
                                                                        <li key={idx}>{bullet}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <a
                                            href={product.ctaUrl}
                                            className="cta-button"
                                            target={product.ctaTarget}
                                        >
                                            {product.ctaText} →
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
