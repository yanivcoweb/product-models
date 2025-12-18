<?php
/**
 * Plugin Name:       Product Models Block
 * Description:       A Gutenberg block for displaying product models with tabs, image galleries, and accordion sections.
 * Version:           1.0.0
 * Requires at least: 6.0
 * Requires PHP:      7.4
 * Author:            Your Name
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       product-models-block
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 */
function product_models_block_init() {
    register_block_type(__DIR__ . '/build');
}
add_action('init', 'product_models_block_init');

/**
 * Enqueue frontend scripts and styles
 */
function product_models_block_enqueue_frontend_assets() {
    if (has_block('create-block/product-models-block')) {
        wp_enqueue_script(
            'product-models-frontend',
            plugins_url('build/frontend.js', __FILE__),
            array(),
            filemtime(plugin_dir_path(__FILE__) . 'build/frontend.js'),
            true
        );
    }
}
add_action('wp_enqueue_scripts', 'product_models_block_enqueue_frontend_assets');
