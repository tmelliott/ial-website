import { FieldHook } from "payload";

export const format = (val: string): string =>
    val
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '')
      .toLowerCase()

export const formatSlug = (name: string): FieldHook =>
    ({data, operation, value}) => {
        if (typeof value === 'string') {
            return format(value);
        }
        if (operation === 'create' || !data?.[name]) {
            const fallbackData = data?.[name];
            if (fallbackData && typeof fallbackData === 'string') {
                return format(fallbackData);
            }
        }
        return value;
    };
