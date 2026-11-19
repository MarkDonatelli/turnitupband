<script setup>
  const { siteUrl } = useRuntimeConfig().public;
  const url = `${siteUrl}/`;
  const title = 'Turn It Up! | Boston Live Cover Band for Weddings, Corporate & Private Events';
  const description =
    'Turn It Up! is Boston’s high-energy cover band playing everything from the classics to today’s hits. Weddings, corporate events, casinos, clubs and private parties across New England.';
  const image = `${siteUrl}/og-image.jpg`;

  useSeoMeta({
    title,
    description,
    ogType: 'website',
    ogSiteName: 'Turn It Up!',
    ogUrl: url,
    ogTitle: title,
    ogDescription: description,
    ogImage: image,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: 'The five members of Turn It Up! standing among light tubes',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: image,
    themeColor: '#0D0C10'
  });

  // Structured data uses only facts shown on the page. Member names and roles
  // mirror components/sections/About.vue; the reel's upload date comes from
  // YouTube. No reviews or ratings (the Reviews section is placeholder copy).
  const members = [
    ['Kelcey', 'Vocals'],
    ['Bob', 'Vocals'],
    ['Mark', 'Guitar'],
    ['Tom', 'Bass'],
    ['James', 'Drums']
  ];
  const band = {
    '@context': 'https://schema.org',
    '@type': 'MusicGroup',
    '@id': `${url}#band`,
    name: 'Turn It Up!',
    url,
    description,
    image,
    logo: `${siteUrl}/images/tiu_newpink.svg`,
    location: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: 'Boston', addressRegion: 'MA', addressCountry: 'US' }
    },
    areaServed: 'New England',
    sameAs: ['https://www.instagram.com/turnitupband/', 'https://www.facebook.com/turnitupcoverband'],
    member: members.map(([name, roleName]) => ({
      '@type': 'OrganizationRole',
      roleName,
      member: { '@type': 'Person', name }
    }))
  };
  const reel = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: 'Turn It Up! live reel',
    description: 'Turn It Up! performing live.',
    thumbnailUrl: [`${siteUrl}/images/reel-poster.jpg`, 'https://i.ytimg.com/vi/JNdmXQs0MIM/hqdefault.jpg'],
    uploadDate: '2024-07-30T17:30:20-07:00',
    embedUrl: 'https://www.youtube-nocookie.com/embed/JNdmXQs0MIM',
    contentUrl: 'https://www.youtube.com/watch?v=JNdmXQs0MIM',
    publisher: { '@id': `${url}#band` }
  };

  useHead({
    link: [{ rel: 'canonical', href: url }],
    script: [
      { type: 'application/ld+json', key: 'ld-band', innerHTML: JSON.stringify(band) },
      { type: 'application/ld+json', key: 'ld-reel', innerHTML: JSON.stringify(reel) }
    ]
  });
</script>

<template>
  <main>
    <HeroMain />
    <Statement />
    <Shows />
    <Events />
    <Songs />
    <Videos />
    <Manifesto />
    <About />
    <!-- Reviews (components/sections/Reviews.vue, data/reviews.js) is hidden
         until real customer quotes replace the placeholders. Restore it here,
         between About and Faq. -->
    <Faq />
    <Contact />
  </main>
  <Footer />
</template>
