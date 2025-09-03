/* jshint esversion: 6 */
/* global wp */

/**
 * Email Restriction Content Block Editor Script
 *
 * @package Email_Restriction_Content_Block
 * @since   1.0.0
 */

( function( wp ) {
	'use strict';

	var registerBlockType = wp.blocks.registerBlockType;
	var InnerBlocks       = wp.blockEditor.InnerBlocks;
	var InspectorControls = wp.blockEditor.InspectorControls;
	var PanelBody         = wp.components.PanelBody;
	var TextControl       = wp.components.TextControl;
	var RichText          = wp.blockEditor.RichText;
	var __                = wp.i18n.__;

	/**
	 * Register the Email Restriction Content Block.
	 *
	 * @since 1.0.0
	 */
	registerBlockType( 'email-restriction-content-block/restricted-content', {
		title: __( 'Restricted Content', 'email-restriction-content-block' ),
		description: __( 'A block to display nested blocks only to logged-in users with an email matching a specified pattern.', 'email-restriction-content-block' ),
		category: 'common',
		icon: 'lock',
		attributes: {
			emailPattern: {
				type:    'string',
				default: '@.*\\.edu'
			},
			loggedInRestrictedMessage: {
				type:    'string',
				default: ''
			},
			notLoggedInMessage: {
				type:    'string',
				default: ''
			}
		},

		/**
		 * Render the block in the editor.
		 *
		 * @since 1.0.0
		 * @param {Object} props Block props.
		 * @return {WPElement} Rendered element.
		 */
		edit: function( props ) {
			var attributes   = props.attributes;
			var setAttributes = props.setAttributes;
			var emailPattern = attributes.emailPattern;
			var loggedInRestrictedMessage = attributes.loggedInRestrictedMessage;
			var notLoggedInMessage = attributes.notLoggedInMessage;

			return [
				wp.element.createElement( InspectorControls, null,
					wp.element.createElement( PanelBody, { title: __( 'Settings', 'email-restriction-content-block' ) },
						wp.element.createElement( TextControl, {
							label: __( 'Email Address Pattern', 'email-restriction-content-block' ),
							value: emailPattern,
							onChange: function( newPattern ) {
								setAttributes( { emailPattern: newPattern } );
							},
							help: __( 'Enter a regex pattern (without delimiters) to match email addresses (e.g., @.*\\.edu for .edu emails, @specific-university\\.edu for a specific domain).', 'email-restriction-content-block' )
						} ),
						wp.element.createElement( 'div', { className: 'restricted-message-control logged-in-message-control' },
							wp.element.createElement( 'label', { className: 'components-base-control__label' }, __( 'Message for Logged-in Users with Non-matching Email', 'email-restriction-content-block' ) ),
							wp.element.createElement( RichText, {
								tagName: 'div',
								multiline: 'p',
								className: 'large-richtext-editor',
								value: loggedInRestrictedMessage,
								onChange: function( newMessage ) {
									setAttributes( { loggedInRestrictedMessage: newMessage } );
								},
								placeholder: __( 'Enter message for logged-in users without access...', 'email-restriction-content-block' ),
								formattingControls: [ 'bold', 'italic', 'link' ],
								identifier: 'loggedInMessageEditor'
							} )
						),
						wp.element.createElement( 'div', { className: 'restricted-message-control not-logged-in-message-control' },
							wp.element.createElement( 'label', { className: 'components-base-control__label' }, __( 'Message for Non-logged-in Users', 'email-restriction-content-block' ) ),
							wp.element.createElement( RichText, {
								tagName: 'div',
								multiline: 'p',
								className: 'large-richtext-editor',
								value: notLoggedInMessage,
								onChange: function( newMessage ) {
									setAttributes( { notLoggedInMessage: newMessage } );
								},
								placeholder: __( 'Enter message for users who are not logged in...', 'email-restriction-content-block' ),
								formattingControls: [ 'bold', 'italic', 'link' ],
								identifier: 'notLoggedInMessageEditor'
							} )
						)
					)
				),
				wp.element.createElement( 'div', { className: 'email-restriction-content-block-editor' },
					wp.element.createElement( InnerBlocks )
				)
			];
		},

		/**
		 * Save the block content.
		 *
		 * @since 1.0.0
		 * @return {WPElement} Saved element.
		 */
		save: function() {
			return wp.element.createElement( 'div', { className: 'email-restriction-content-block' },
				wp.element.createElement( InnerBlocks.Content )
			);
		}
	} );
} )( wp );