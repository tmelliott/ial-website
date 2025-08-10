import sharp from "sharp";
import {
  FixedToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

import { HomeHero } from "@/globals/Home/Hero";

import { News } from "./src/collections/News";
import { Projects } from "@/collections/Projects";
import { Images } from "@/collections/media/Images";
import { Documents } from "@/collections/media/Documents";
import { Data } from "@/collections/media/Data";
import { HomeProjects } from "@/globals/Home/Projects";
import { General } from "@/globals/General";

import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { Keywords } from "@/collections/Keywords";
import { HomeCollaborators } from "@/globals/Home/Collaborators";
import { HomeApps } from "@/globals/Home/Apps";

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
    ],
  }),

  serverURL: process.env.SERVER_URL || "http://localhost:3000",

  globals: [General, HomeHero, HomeProjects, HomeCollaborators, HomeApps],

  // Define and configure your collections in this array
  collections: [Projects, News, Images, Documents, Data, Keywords],

  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        images: true,
        data: true,
        documents: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || "",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
});
