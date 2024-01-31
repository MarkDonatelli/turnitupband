<script setup>
  const form = ref({
    name: '',
    email: '',
    message: ''
  });
</script>

<template>
  <div>
    <form
      action="/"
      method="POST"
      name="contact-form"
      netlify
      netlify-honeypot="bot-field"
    >
      <input name="bot-field" type="hidden" />
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
  ;
</template>
