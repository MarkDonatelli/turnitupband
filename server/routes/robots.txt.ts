// Production is crawlable; previews, branch deploys and local builds are not.
export default defineEventHandler(event => {
  const { siteUrl, deployContext } = useRuntimeConfig(event).public;
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8');
  return deployContext === 'production'
    ? `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
    : 'User-agent: *\nDisallow: /\n';
});
