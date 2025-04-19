import { formatSlug } from "@/lib/slugs";
import { CollectionConfig } from "payload";

export const News: CollectionConfig = {
    slug: 'news',
    fields: [
        {
            name: 'title',
            label: 'Title',
            type: 'text',
            required: true,
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            required: true,
            unique: true,
            admin: {
                position: 'sidebar',
                description: 'The slug is used to identify the news item in the URL.',
                // readOnly: true,
            },
            hooks: {
                beforeValidate: [
                    formatSlug('title'),
                ]
            }
        },
        {
            name: 'content',
            label: 'Content',
            type: 'richText',
            required: true,
        },
    ],
    versions: {
        drafts: true,
    },
}
