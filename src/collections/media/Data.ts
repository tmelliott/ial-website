import type { CollectionConfig } from "payload";

export const Data: CollectionConfig = {
    slug: 'data',
    upload: {
        staticDir: 'data',
        mimeTypes: ['application/json', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain'],
    },
    fields: [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            label: 'Description',
            type: 'textarea',
        },
        {
            name: 'source',
            label: 'Source',
            type: 'text',
            required: true,
        },
    ],
    admin: {
        group: 'Media',
    }
}
