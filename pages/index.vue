<script setup>
  const contact_name = ref(null);
</script>

<template>
  <Head><Title>Turn It Up | Boston, MA</Title></Head>
  <div class="main">
    <div>
      <h1>Turn It Up!</h1>
    </div>
    <p>Coming Soon...&#129304;</p>

    <form name="contactForm" method="post" netlify-honeypot="bot-field" netlify>
      <input type="hidden" name="form-name" value="contactForm" />
      <input
        v-model="contact_name"
        name="name"
        type="text"
        placeholder="Name"
      />
      <button type="submit" class="btn btn-primary">Send Message</button>
    </form>
  </div>
</template>

<style scoped lang="scss"></style>
