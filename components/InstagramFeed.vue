<script setup>
  const config = useRuntimeConfig();
  const instagramData = ref({});

  onMounted(async () => {
    await fetchInstagramData();
  });

  async function fetchInstagramData() {
    const url = `https://graph.instagram.com/me?fields=id,username,media.limit(16){media_count,media_type,permalink,caption,media_url}&access_token=IGQWROSVBpTklZAdmRwdGMzWkNEOUp5TlA1eFltaGZAmRlVUaWFsZAnA0bk41S0ZAoeE05ZAzctNDV5OWFEX09udlcxcV9KU1dYS2J6bGE0QThPVlhEc09nSEpwT3pZAd3VZAMjVMTjE5R25sUXp0dHBGY2tnNDBVRllzY0EZD`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch Instagram data');
      }
      const data = await response.json();

      const filteredData = data.media.data.filter(
        (item) => item.media_type !== 'CAROUSEL_ALBUM'
      );
      instagramData.value = filteredData;

      // console.log(filteredData);
    } catch (error) {
      console.error('Error fetching Instagram data:', error);
    }
  }
</script>

<template>
  <div class="bg-black pt-14 md:pt-20">
    <div class="container">
      <div class="relative mb-10 text-center">
        <NuxtImg
          class="hidden md:block absolute w-full max-w-[250px] -top-2 left-5 z-0"
          src="images/ig-group.svg"
        />
        <div class="relative inline-block">
          <h2 class="z-10 mb-3 text-4xl font-extrabold text-white md:text-5xl">
            Instagram
          </h2>
          <div class="block md:hidden">
            <Icon
              class="absolute -top-[10px] text-[60px] -left-[70px] text-pink hover:text-pink"
              name="uil:instagram"
            />
          </div>
        </div>

        <p class="text-lg font-semibold md:text-xl text-pink font-barlow">
          VISIT US ON IG!
        </p>
      </div>
    </div>

    <div class="relative grid gap-3 grid--ig">
      <div v-for="item in instagramData" :key="item.id" class="flex">
        <div
          v-if="item.media_type === 'IMAGE'"
          class="relative overflow-hidden bg-black cursor-pointer group"
        >
          <img
            class="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
            :src="item.media_url"
          />
          <div
            class="absolute top-0 z-10 w-full h-full bg-black opacity-0 group-hover:opacity-75"
          ></div>

          <div
            class="absolute z-10 w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 font-mont"
          >
            <div
              class="flex-col items-center hidden w-full p-3 text-center group-hover:flex"
            >
              <a :href="item.permalink" target="_blank" class="">
                <Icon
                  class="text-6xl text-white transition-all duration-200 md:text-7xl hover:text-pink"
                  name="uil:instagram"
                />
              </a>
            </div>
          </div>
        </div>

        <div
          v-else
          class="relative overflow-hidden bg-black cursor-pointer group"
        >
          <video
            width="320"
            height="240"
            class="object-cover w-full h-full transition-all duration-500 group-hover:scale-110"
          >
            <source :src="item.media_url" type="video/mp4" />
          </video>

          <div
            class="absolute top-0 z-10 w-full h-full bg-black opacity-0 group-hover:opacity-75"
          ></div>
          <div
            class="absolute z-10 w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 font-mont"
          >
            <div
              class="flex-col items-center hidden w-full p-3 text-center group-hover:flex"
            >
              <a :href="item.permalink" target="_blank" class="">
                <Icon
                  class="text-6xl text-white transition-all duration-200 md:text-7xl hover:text-pink"
                  name="uil:instagram"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .grid--ig {
    grid-template-columns: repeat(2, 1fr);

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }

    @media (min-width: 1280px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>
