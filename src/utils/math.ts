export const computeLimitAndOffset = (page: number, size: number = 50) => {
	const limit = size;
	const offset = page > 0 ? (page - 1) * limit : 0;

	return { limit, offset };
};
