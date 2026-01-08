import type { CollectionConfig } from "payload";
import { teamMembers } from "../access/teamMembers";

export const Data: CollectionConfig = {
    slug: 'data',
    access: {
        read: () => true,
        create: teamMembers,
        update: teamMembers,
        delete: teamMembers,
    },
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
