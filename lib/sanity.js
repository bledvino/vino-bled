import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '7dozj6am',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01',
});

export async function getWinemakers() {
  return await sanityClient.fetch(`
    *[_type == "winemaker"] | order(order asc, name asc) {
      _id,
      name,
      slug,
      region,
      "photo": photo.asset->url,
      description,
      website
    }
  `);
}

export async function getWines() {
  return await sanityClient.fetch(`
    *[_type == "wine"] | order(name asc) {
      _id,
      name,
      "winemaker": winemaker->{name, slug, region},
      grape,
      vintage,
      type,
      "photo": photo.asset->url,
      description,
      price,
      tastings,
      available
    }
  `);
}

export async function getWinemakersByRegion(region) {
  return await sanityClient.fetch(`
    *[_type == "winemaker" && region == $region] | order(order asc, name asc) {
      _id,
      name,
      slug,
      region,
      "photo": photo.asset->url,
      description,
      website
    }
  `, { region });
}

export async function getCounts() {
  const winemakers = await sanityClient.fetch(`count(*[_type == "winemaker"])`);
  const wines = await sanityClient.fetch(`count(*[_type == "wine" && available == true])`);
  return { winemakers, wines, regions: 9 };
}
