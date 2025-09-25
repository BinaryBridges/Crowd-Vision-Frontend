export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const VALIDATION_MESSAGES = {
	REQUIRED_FULL_NAME: 'Please enter your full name.',
	INVALID_EMAIL: 'Please enter a valid email address.',
	INVALID_PASSWORD:
		'Min 8 chars, with 1 uppercase, 1 lowercase, 1 number, and 1 special character.',
	PASSWORDS_DO_NOT_MATCH: 'Passwords do not match.',
	REQUIRED_PASSWORD: 'Please enter your password.'
} as const;

export const FIELD_CONSTRAINTS = {
	PASSWORD_MIN_LENGTH: 8,
	PASSWORD_REQUIRES_LOWERCASE: true,
	PASSWORD_REQUIRES_UPPERCASE: true,
	PASSWORD_REQUIRES_NUMBER: true,
	PASSWORD_REQUIRES_SPECIAL_CHAR: true
} as const;
