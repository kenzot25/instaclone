import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = sanityClient({
  projectId: "nj51q290", // find this at manage.sanity.io or in your sanity.json
  dataset: "production", // this is from those question during 'sanity init',
  apiVersion: "2021-11-16",
  useCdn: false,
  token: process.env.REACT_APP_SANITY_TOKEN,
  ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source) => builder.image(source);
