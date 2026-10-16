/** Lets `node --test` load extensionless TypeScript imports in this CommonJS package. */
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !/\.(?:mjs|cjs|js|json|ts|node)$/.test(specifier)) {
    return nextResolve(`${specifier}.ts`, context);
  }
  return nextResolve(specifier, context);
}
