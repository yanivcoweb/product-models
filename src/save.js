import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function save({ attributes }) {
    const { tabs, products } = attributes;
    const blockProps = useBlockProps.save();

    // Group products by tab
    const productsByTab = tabs.reduce((acc, tab) => {
        acc[tab.id] = products.filter(p => p.tabId === tab.id);
        return acc;
    }, {});

    return (
        <div {...blockProps}>
            <div className="product-models-block">
                {/* Tab Navigation */}
                <div className="tab-navigation">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab.id}
                            className={`tab-button ${index === 0 ? 'active' : ''}`}
                            data-tab-id={tab.id}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {tabs.map((tab, index) => (
                    <div
                        key={tab.id}
                        className={`tab-content ${index === 0 ? 'active' : ''}`}
                        data-tab-content={tab.id}
                    >
                        <div className="products-container">
                            {productsByTab[tab.id] && productsByTab[tab.id].length > 0 ? (
                                productsByTab[tab.id].map((product) => (
                                    <div
                                        key={product.id}
                                        className="product-item"
                                        id={product.customId || undefined}
                                    >
                                        {/* Product Images */}
                                        <div className="product-images">
                                            {product.images.length > 0 && (
                                                <>
                                                    <div className="main-image-container">
                                                        <button className="nav-arrow prev-arrow" aria-label="Previous image">
                                                            ‹
                                                        </button>
                                                        <div className="main-image">
                                                            {product.images.map((img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={img.url}
                                                                    alt={img.alt}
                                                                    className={idx === 0 ? 'active' : ''}
                                                                    data-image-index={idx}
                                                                />
                                                            ))}
                                                        </div>
                                                        <button className="nav-arrow next-arrow" aria-label="Next image">
                                                            ›
                                                        </button>
                                                    </div>
                                                    {product.images.length > 1 && (
                                                        <div className="thumbnail-images">
                                                            {product.images.map((img, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={img.url}
                                                                    alt={img.alt}
                                                                    className={idx === 0 ? 'active' : ''}
                                                                    data-thumbnail-index={idx}
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="product-details">
                                            <RichText.Content
                                                tagName="h2"
                                                className="product-title-box"
                                                value={product.title}
                                            />

                                            {/* Accordions */}
                                            <div className="accordions">
                                                {product.accordions.map((accordion, accIndex) => (
                                                    <div
                                                        key={accordion.id}
                                                        className={`accordion-item ${accIndex === 0 ? 'active' : ''}`}
                                                        data-accordion-id={accordion.id}
                                                    >
                                                        <button
                                                            className="accordion-header"
                                                            aria-expanded={accIndex === 0 ? 'true' : 'false'}
                                                        >
                                                            <RichText.Content
                                                                tagName="span"
                                                                value={accordion.title}
                                                            />
                                                            <span className="accordion-icon">
                                                                {accIndex === 0 ? '−' : '+'}
                                                            </span>
                                                        </button>
                                                        <div
                                                            className="accordion-content"
                                                            style={{ display: accIndex === 0 ? 'block' : 'none' }}
                                                        >
                                                            {accordion.content && (
                                                                <RichText.Content
                                                                    tagName="p"
                                                                    value={accordion.content}
                                                                />
                                                            )}
                                                            {accordion.bulletPoints.length > 0 && (
                                                                <RichText.Content
                                                                    tagName="ul"
                                                                    value={`<li>${accordion.bulletPoints.join('</li><li>')}</li>`}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* CTA Button */}
                                            <RichText.Content
                                                tagName="a"
                                                className="button bg-accent"
                                                value={`${product.ctaText}`}
                                                href={product.ctaUrl}
                                                target={product.ctaTarget}
                                                rel={product.ctaTarget === '_blank' ? 'noopener noreferrer' : ''}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-products">No products in this tab.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
