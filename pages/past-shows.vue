<script setup>
  useHead({
    title: 'Past Shows | Turn It Up!',
    meta: [{ name: 'description', content: 'Look back at past Turn It Up! shows across Boston and New England.' }]
  });
</script>

<template>
  <main class="min-h-screen pt-[100px] bg-black">
    <ShowsList past />
  </main>
</template>
