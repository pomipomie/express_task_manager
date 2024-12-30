import bcrypt from "bcrypt";

export const generateHash = async (input: string): Promise<string> => {
	const salt = await bcrypt.genSalt(10);
	const hash = await bcrypt.hash(input, salt);

	return hash;
};

export const compareHash = async (
	input: string,
	hash: string
): Promise<boolean> => {
	const match = await bcrypt.compare(input, hash);
	return match;
};
