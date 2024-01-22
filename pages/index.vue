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
        name="contact-form"
        netlify
        netlify-honeypot="bot-field"
      >
        <p class="hidden">
          <label>
            Don’t fill this out if you’re human:
            <input name="bot-field" />
          </label>
        </p>
        <input type="hidden" name="form-name" value="contact-form" />
        <input
          type="text"
          name="name"
          v-model="form.name"
          placeholder="Name"
          required
        />

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
