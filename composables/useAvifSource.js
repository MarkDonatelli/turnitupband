// AVIF version of a photo already shown with <NuxtImg>: the same `sizes`,
// widths and crop (width/height), only the format differs. Used as
//
//   <picture class="contents">
//     <source type="image/avif" :srcset="x.srcset" :sizes="x.sizes" />
//     <NuxtImg ... format="webp" />   <- unchanged, and the fallback
//   </picture>
//
// `display: contents` keeps <picture> out of the layout, and <NuxtImg> stays
// the element the section's scoped styles target. With the static build the
// AVIF files are generated at build time alongside the WebP ones.
export default function useAvifSource(src, { sizes, width, height } = {}) {
  const img = useImage();
  const modifiers = { format: 'avif' };
  if (width) modifiers.width = Number(width);
  if (height) modifiers.height = Number(height);
  const { srcset, sizes: sizesAttr } = img.getSizes(src, { sizes, modifiers });
  return { srcset, sizes: sizesAttr };
}
