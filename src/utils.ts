export const stringify = (data: unknown) => {
	try {
		const maybe_string = JSON.stringify(data);
		return maybe_string ?? `${data}`;
	} catch {
		return `${data}`;
	}
};
