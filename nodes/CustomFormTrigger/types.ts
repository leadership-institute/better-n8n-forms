/**
 * Shared types for CustomFormTrigger node and React renderer
 * This defines the JSON contract between n8n and the frontend
 */

// ============================================================================
// Field Types
// ============================================================================

export type FieldType =
	// Basic Inputs
	| 'text'
	| 'email'
	| 'number'
	| 'tel'
	| 'url'
	| 'password'
	| 'textarea'
	| 'zip'
	// Selection
	| 'select'
	| 'multiselect'
	| 'radio'
	| 'checkbox'
	| 'checkboxGroup'
	| 'ranking'
	// Date & Time
	| 'date'
	| 'time'
	| 'datetime'
	| 'dateRange'
	// Special Inputs
	| 'currency'
	| 'address'
	| 'signature'
	| 'file'
	| 'multiFile'
	| 'richtext'
	| 'markdown'
	| 'code'
	// Numeric / Range
	| 'range'
	| 'rating'
	// Toggle
	| 'toggle'
	// Color
	| 'color'
	// Composite
	| 'fullName'
	| 'intlPhone'
	// Display / Layout (not submitted)
	| 'heading'
	| 'paragraph'
	| 'divider'
	| 'step'
	| 'hidden'
	// Payment
	| 'payment';

// ============================================================================
// Field Width
// ============================================================================

export type FieldWidth = 'full' | 'half' | 'third' | 'quarter';

// ============================================================================
// Conditional Visibility
// ============================================================================

export type ConditionOperator = 'eq' | 'neq' | 'contains' | 'notEmpty';
export type ConditionMode = 'show' | 'hide';

export interface FieldCondition {
	/** The fieldName of the field to watch */
	dependsOn: string;
	/** How to compare the value */
	operator: ConditionOperator;
	/** Target value(s). Comma-separated for OR logic. */
	value: string;
	/** show = hidden by default, appears on match. hide = visible by default, hides on match */
	mode: ConditionMode;
}

// ============================================================================
// Field Validation
// ============================================================================

export interface FieldValidation {
	/** Regex pattern the value must match */
	pattern?: string;
	/** Error message shown when pattern doesn't match */
	patternError?: string;
	/** Minimum character length */
	minLength?: number;
	/** Maximum character length (0 = no limit) */
	maxLength?: number;
}

// ============================================================================
// Field Option (for select, radio, checkbox, ranking)
// ============================================================================

export interface FormOption {
	label: string;
	value: string;
}

// ============================================================================
// Form Field
// ============================================================================

export interface FormField {
	/** The field type */
	type: FieldType;
	/** Display label shown to user */
	label: string;
	/** JSON key in submission payload (slugified) */
	fieldName: string;
	/** Placeholder text */
	placeholder?: string;
	/** Help text displayed below the field */
	helpText?: string;
	/** Default value */
	defaultValue?: string;
	/** Whether field is required */
	required?: boolean;
	/** Field width in layout */
	width?: FieldWidth;
	/** Whether field is disabled/read-only */
	disabled?: boolean;

	// -------------------------------------------------------------------------
	// Type-specific properties
	// -------------------------------------------------------------------------

	/** Options for select, multiselect, radio, checkboxGroup, ranking */
	options?: FormOption[];

	/** Maximum selections for ranking field */
	maxSelections?: number;

	/** Min value for number, range, currency */
	min?: number;
	/** Max value for number, range, currency */
	max?: number;
	/** Step value for number, range */
	step?: number;

	/** Max stars for rating field (default 5) */
	maxStars?: number;

	/** Currency symbol for currency field (default $) */
	currencySymbol?: string;

	/** Number of rows for textarea, richtext, markdown, code */
	rows?: number;

	/** Code language for code field */
	codeLanguage?: string;

	/** Accepted file types for file, multiFile (e.g. ".pdf,.jpg,.png") */
	acceptedFileTypes?: string;
	/** Max file size in MB for file, multiFile */
	maxFileSize?: number;
	/** Max number of files for multiFile */
	maxFiles?: number;

	/** Country restriction for address (ISO 3166-1 alpha-2) */
	countryRestriction?: string;

	/** Static value for hidden field */
	hiddenValue?: string;

	/** Text content for heading, paragraph */
	content?: string;
	/** Heading level for heading field */
	headingLevel?: 'h2' | 'h3' | 'h4';

	/** Step label for step field (multi-step forms) */
	stepLabel?: string;

	/** Payment amount for payment field */
	paymentAmount?: string;
	/** Early bird price for payment field */
	earlyBirdPrice?: string;
	/** Allow discount codes for payment field */
	allowDiscountCode?: boolean;

	// -------------------------------------------------------------------------
	// Validation & Conditions
	// -------------------------------------------------------------------------

	/** Validation rules */
	validation?: FieldValidation;

	/** Conditional visibility */
	condition?: FieldCondition;
}

// ============================================================================
// Multi-Step Form
// ============================================================================

export interface FormStep {
	/** Step label shown in progress indicator */
	label: string;
	/** Field names belonging to this step */
	fieldNames: string[];
}

// ============================================================================
// Theme Configuration
// ============================================================================

export interface FormTheme {
	/** Primary accent color (default #4f46e5) */
	primaryColor: string;
	/** Background color (default #f9fafb) */
	backgroundColor: string;
	/** Font family (default system-ui, sans-serif) */
	fontFamily: string;
	/** Border radius in pixels (default 8) */
	borderRadius: number;
	/** Logo URL (optional) */
	logoUrl?: string;
	/** Custom CSS injected by renderer (optional) */
	customCss?: string;
}

// ============================================================================
// Form Configuration (GET response)
// ============================================================================

export interface FormConfig {
	/** Form title displayed at top */
	formTitle: string;
	/** Form description/instructions */
	formDescription: string;
	/** Submit button label (default "Submit") */
	submitLabel: string;
	/** Success message shown after submission */
	successMessage: string;
	/** Redirect URL after submission (optional, instead of success message) */
	redirectUrl?: string;
	/** The POST endpoint for submissions */
	submitUrl: string;

	/** Theme customization */
	theme: FormTheme;

	/** Multi-step configuration (null if single-page form) */
	steps?: FormStep[];

	/** All form fields in order (includes step markers) */
	fields: FormField[];
}

// ============================================================================
// Submission Response (POST response)
// ============================================================================

export interface FormSubmissionResponse {
	/** Whether submission was successful */
	success: boolean;
	/** Message to display */
	message: string;
	/** Redirect URL (optional, overrides successMessage) */
	redirectUrl?: string;
	/** Field-specific validation errors */
	fieldErrors?: Record<string, string>;
}

// ============================================================================
// Display-only field types (not included in submission)
// ============================================================================

export const DISPLAY_ONLY_TYPES: FieldType[] = [
	'heading',
	'paragraph',
	'divider',
	'step',
];
