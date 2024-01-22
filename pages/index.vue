<script setup>
  const form = ref({
    name: '',
    email: '',
    message: ''
  });

  async function handleSubmit() {
    const formData = new FormData();
    for (let key in form.value) {
      formData.append(key, form.value[key]);
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        // Form submission successful
      } else {
        // Handle error
      }
    } catch (error) {
      // Handle error
    }
  }
</script>

<template>
  <Head><Title>Turn It Up | Boston, MA</Title></Head>
  <div class="main">
    <div>
      <h1>Turn It Up!</h1>
    </div>
    <p>Coming Soon...&#129304;</p>

    <form
      @submit.prevent="handleSubmit"
      name="contact"
      action=""
      method="POST"
      netlify
    >
      <input type="text" v-model="form.name" placeholder="Name" />
      <input type="email" v-model="form.email" placeholder="Email" />
      <textarea v-model="form.message" placeholder="Message"></textarea>
      <button type="submit">Send</button>
    </form>
  </div>
</template>

<style scoped lang="scss"></style>
