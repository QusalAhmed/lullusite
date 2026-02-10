/**
 * Validates and normalizes phone numbers for Bangladesh
 * Accepts formats like:
 * - 01XXXXXXXXX (11 digits)
 * - +8801XXXXXXXXX
 * - 8801XXXXXXXXX
 */
export function validatePhoneNumber(phone: string): {
    isValid: boolean;
    normalized?: string;
    error?: string;
} {
    try {
        // Remove all whitespace and special characters except +
        const cleaned = phone.replace(/[\s()-]/g, "");

        // Pattern for Bangladesh phone numbers
        const patterns = [
            /^01[3-9]\d{8}$/, // 01XXXXXXXXX (11 digits)
            /^\+8801[3-9]\d{8}$/, // +8801XXXXXXXXX (14 chars)
            /^8801[3-9]\d{8}$/, // 8801XXXXXXXXX (13 digits)
        ];

        for (const pattern of patterns) {
            if (pattern.test(cleaned)) {
                // Normalize to +8801XXXXXXXXX format
                let normalized = cleaned;
                if (normalized.startsWith("01")) {
                    normalized = "+88" + normalized;
                } else if (normalized.startsWith("88")) {
                    normalized = "+" + normalized;
                }

                return {
                    isValid: true,
                    normalized,
                };
            }
        }

        return {
            isValid: false,
            error: "Invalid Bangladesh phone number format. Expected format: 01XXXXXXXXX",
        };
    } catch (error: unknown) {
        return {
            isValid: false,
            error: error instanceof Error ? error.message : "Unknown error during phone number validation",
        };
    }
}

/**
 * Formats phone number for display
 * +8801712345678 -> +880 1712-345678
 */
export function formatPhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[\s()-]/g, "");

    if (cleaned.startsWith("+880")) {
        const rest = cleaned.substring(4);
        return `+880 ${rest.substring(0, 4)}-${rest.substring(4)}`;
    }

    if (cleaned.startsWith("880")) {
        const rest = cleaned.substring(3);
        return `+880 ${rest.substring(0, 4)}-${rest.substring(4)}`;
    }

    if (cleaned.startsWith("01")) {
        return `${cleaned.substring(0, 4)}-${cleaned.substring(4)}`;
    }

    return phone;
}

