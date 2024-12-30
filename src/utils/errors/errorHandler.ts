type ExtendedError = Error & { code?: string };

export const getErrorDetails = (
	e: unknown
): { message: string; code: string } => {
	if (typeof e === "string") {
		return { message: e.toUpperCase(), code: "" };
	} else if (e instanceof Error) {
		return {
			message: e.message || "An unknown error occurred",
			code: (e as ExtendedError).code || "", // Safely check for `code` property
		};
	}

	// Fallback for unexpected error types
	return { message: "An unknown error occurred", code: "" };
};
