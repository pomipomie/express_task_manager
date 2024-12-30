export function bindMethods(instance: any) {
	const proto = Object.getPrototypeOf(instance);
	const propertyNames = Object.getOwnPropertyNames(proto);

	for (const name of propertyNames) {
		if (name !== "constructor" && typeof instance[name] === "function") {
			instance[name] = instance[name].bind(instance);
		}
	}
}
