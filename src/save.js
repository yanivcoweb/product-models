import { useBlockProps } from '@wordpress/block-editor';

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
                                    <div key={product.id} className="product-item">
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
                                            <h2 className="product-title">{product.title}</h2>

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
                                                            <span>{accordion.title}</span>
                                                            <span className="accordion-icon">
                                                                {accIndex === 0 ? '−' : '+'}
                                                            </span>
                                                        </button>
                                                        <div
                                                            className="accordion-content"
                                                            style={{ display: accIndex === 0 ? 'block' : 'none' }}
                                                        >
                                                            {accordion.content && <p>{accordion.content}</p>}
                                                            {accordion.bulletPoints.length > 0 && (
                                                                <ul>
                                                                    {accordion.bulletPoints.map((bullet, idx) => (
                                                                        <li key={idx}>{bullet}</li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* CTA Button */}
                                            <a
                                                href={product.ctaUrl}
                                                className="cta-button"
                                                target={product.ctaTarget}
                                                rel={product.ctaTarget === '_blank' ? 'noopener noreferrer' : ''}
                                            >
                                                {product.ctaText} →
                                            </a>
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
