<?php
/**
 * Plugin Name: Email Restriction Content Block
 * Description: A custom WordPress block to display content only to logged-in users with a specified email address pattern.
 * Version:     1.8.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register block assets and the block type.
 *
 * @since 1.0.0
 */
function email_restriction_content_block_register() {
	// Register editor script.
	wp_register_script(
		'email-restriction-content-block-editor',
		plugins_url( 'block.js', __FILE__ ),
		array(
			'wp-blocks',
			'wp-element',
			'wp-editor',
			'wp-components',
			'wp-i18n',
			'wp-block-editor',
		),
		filemtime( plugin_dir_path( __FILE__ ) . 'block.js' ),
		true
	);

	// Register editor style.
	wp_register_style(
		'email-restriction-content-block-editor-style',
		plugins_url( 'editor.css', __FILE__ ),
		array( 'wp-edit-blocks' ),
		filemtime( plugin_dir_path( __FILE__ ) . 'editor.css' )
	);

	// Register front-end style.
	wp_register_style(
		'email-restriction-content-block-frontend-style',
		plugins_url( 'style.css', __FILE__ ),
		array(),
		filemtime( plugin_dir_path( __FILE__ ) . 'style.css' )
	);

	register_block_type(
		'email-restriction-content-block/restricted-content',
		array(
			'editor_script'   => 'email-restriction-content-block-editor',
			'editor_style'    => 'email-restriction-content-block-editor-style',
			'style'           => 'email-restriction-content-block-frontend-style',
			'render_callback' => 'email_restriction_content_block_render',
			'attributes'      => array(
				'emailPattern' => array(
					'type'    => 'string',
					'default' => '@.*\.edu',
				),
				'loggedInRestrictedMessage' => array(
					'type'    => 'string',
					'default' => '',
				),
				'notLoggedInMessage' => array(
					'type'    => 'string',
					'default' => '',
				),
			),
		)
	);
}
add_action( 'init', 'email_restriction_content_block_register' );

/**
 * Render the block content based on user email and login status.
 *
 * @since 1.0.0
 * @param array  $attributes Block attributes.
 * @param string $content    Rendered inner blocks content.
 * @return string Rendered block HTML.
 */
function email_restriction_content_block_render( $attributes, $content ) {
	// Default messages if none provided.
	$default_logged_in_message   = 'Your email address does not have access to this content. Please <a href="/contact">contact the site administrator</a>.';
	$default_not_logged_in_message = 'Please <a href="/wp-login.php">log in</a> with an authorized email address to view this content.';
	$logged_in_message          = ! empty( $attributes['loggedInRestrictedMessage'] ) ? $attributes['loggedInRestrictedMessage'] : $default_logged_in_message;
	$not_logged_in_message      = ! empty( $attributes['notLoggedInMessage'] ) ? $attributes['notLoggedInMessage'] : $default_not_logged_in_message;

	// Check if user is logged in.
	if ( ! is_user_logged_in() ) {
		return '<div class="email-restriction-content-block restricted">' . wp_kses_post( $not_logged_in_message ) . '</div>';
	}

	// Get current user.
	$user  = wp_get_current_user();
	$email = $user->user_email;

	// Get email pattern, default to @.*\.edu if empty or invalid.
	$email_pattern = ! empty( $attributes['emailPattern'] ) ? $attributes['emailPattern'] : '@.*\.edu';

	// Validate regex pattern.
	$is_valid_pattern = @preg_match( '/' . $email_pattern . '/', '' ) !== false;
	if ( ! $is_valid_pattern ) {
		return '<div class="email-restriction-content-block restricted">' . wp_kses_post( $logged_in_message ) . '</div>';
	}

	// Check if email matches the specified pattern.
	if ( ! preg_match( '/' . $email_pattern . '/', $email ) ) {
		return '<div class="email-restriction-content-block restricted">' . wp_kses_post( $logged_in_message ) . '</div>';
	}

	// Return the inner blocks content if user passes checks.
	return '<div class="email-restriction-content-block">' . $content . '</div>';
}