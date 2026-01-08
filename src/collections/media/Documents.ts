import type { CollectionConfig } from "payload";
import { teamMembers } from "../access/teamMembers";

export const Documents: CollectionConfig = {
    slug: 'documents',
    access: {
        read: () => true,
        create: teamMembers,
        update: teamMembers,
        delete: teamMembers,
    },
    upload: {
        staticDir: 'media/documents',
        mimeTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
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
    ],
    admin: {
        group: 'Media',
    }
}
