<script setup>
  const form = ref({
    name: '',
    email: '',
    message: ''
  });
</script>

<template>
  <Head><Title>Turn It Up | Boston, MA</Title></Head>
  <div class="main">
    <div>
      <h1>Turn It Up!</h1>
    </div>
    <p>Coming Soon...&#129304;</p>

    <div>
      <form
        action="/"
        method="POST"
        data-netlify="true"
        name="contact-form"
        netlify-honeypot="bot-field"
      >
        <input
          type="text"
          name="name"
          v-model="form.name"
          placeholder="Name"
          required
        />
        <input type="hidden" name="contact-form" value="contact-form" />
        <input
          type="email"
          name="email"
          v-model="form.email"
          placeholder="Email"
          required
        />
        <textarea
          v-model="form.message"
          placeholder="Message"
          name="message"
          required
        ></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
