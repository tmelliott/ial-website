import { formatSlug } from "@/lib/slugs";
import { CollectionConfig } from "payload";

export const Projects: CollectionConfig = {
    slug: 'projects',
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
        // list of files
        // gallery
        // keywords
        // is featured?
        {
            name: 'featured',
            label: 'Featured',
            type: 'checkbox',
            defaultValue: false,
            admin: {
                position: 'sidebar',
                description: 'Show this project on the homepage.',
            }
        },
        // links
        {
            name: 'links',
            label: 'Links',
            type: 'array',
            fields: [
                {
                    name: 'link',
                    label: 'Link',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: 'text',
                    required: false,
                },
                {
                    name: 'group',
                    label: 'Group',
                    type: 'text',
                    required: false,
                    admin: {
                        description: 'Optional: organise link under this heading',
                    },
                }
            ],
            admin: {
                position: 'sidebar',

            }
        },
    ]
}
