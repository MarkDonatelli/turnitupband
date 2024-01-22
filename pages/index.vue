<script setup>
  const form = ref({
    name: ''
  });
</script>

<template>
  <Head><Title>Turn It Up | Boston, MA</Title></Head>
  <div class="main">
    <div>
      <h1>Turn It Up!</h1>
    </div>
    <p>Coming Soon...&#129304;</p>

    <form
      name="contact"
      action=""
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
    >
      <input type="text" v-model="form.name" placeholder="Name" />

      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped lang="scss"></style>
