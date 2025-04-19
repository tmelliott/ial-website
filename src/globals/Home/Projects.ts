import { GlobalConfig } from "payload";

export const HomeProjects: GlobalConfig = {
    slug: 'homeProjects',
    label: 'Projects',
    fields: [
        {
            name: 'projectsTitle',
            label: 'Projects Title',
            type: 'text',
            defaultValue: 'We do data differently'
        },
        {
            name: 'projectsDescription',
            label: 'Projects Description',
            type: 'richText'
        }
    ],
    admin: {
        group: 'Home page'
    }
};
