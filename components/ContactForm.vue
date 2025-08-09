<script setup>
  /*
  imports
  */
  import { useVuelidate } from '@vuelidate/core';
  import { required, email, helpers } from '@vuelidate/validators';

  /*
    custom validation helpers
    */
  const phoneNumberRegex =
    /^\+?([0-9]{1,3})?([-.\s])?((\([0-9]{1,3}\))|[0-9]{1,3})?([-.\s])?([0-9]{1,4})([-.\s])?([0-9]{1,4})([-.\s])?([0-9]{1,9})$/;

  /*
    form state
    */
  const formState = ref({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const isSubmitted = ref(false);

  /*
    validation rules
    */
  const rules = {
    name: {
      required: helpers.withMessage('Please enter your full name', required)
    },
    email: {
      required: helpers.withMessage(
        'Please enter your email address',
        required
      ),
      email: helpers.withMessage('Please enter a valid email address', email)
    },
    phone: {
      required: helpers.withMessage('Please enter your phone number', required),
      isPhoneNumberValid: helpers.withMessage(
        'Please enter a valid phone number',
        helpers.regex(phoneNumberRegex)
      )
    },
    subject: {
      required: helpers.withMessage('Please enter subject', required)
    },
    message: {
      required: helpers.withMessage('Please enter your message', required)
    }
  };

  /*
    init vuelidate
    */
  const v$ = useVuelidate(rules, formState);

  /*
    form submit
    */
  const handleValidation = async (event) => {
    event.preventDefault();
    await v$.value.$validate();

    if (!v$.value.$error) {
      const formData = new FormData(event.target);

      fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
      })
        .then(() => {
          isSubmitted.value = true; // Show success message
        })
        .catch((error) => console.error(error));
    }
  };
</script>

<template>
  <div class="relative w-full mx-auto md:max-w-[700px]">
    <div v-if="!isSubmitted">
      <form
        @submit="handleValidation"
        action="/"
        method="POST"
        name="contact-form"
        netlify
        netlify-honeypot="bot-field"
        class="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 md:p-8 shadow-[0_8px_24px_rgba(0,0,0,0.35)] mt-6"
      >
        <input name="bot-field" type="hidden" />
        <input type="hidden" name="form-name" value="contact-form" />

        <!-- 2-col on desktop -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <!-- Name -->
          <div>
            <label
              for="name"
              class="block mb-2 text-xs font-semibold tracking-widest uppercase md:text-sm text-white/80"
            >
              Name
              <span class="text-pink">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              v-model="formState.name"
              :aria-invalid="v$.name?.$error || null"
              class="w-full rounded-xl px-3.5 py-3 bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-pink focus:ring-2 focus:ring-pink/40 outline-none transition"
              placeholder="Your name"
              :class="{ 'border-red-500 focus:ring-red-400': v$.name?.$error }"
            />
            <p
              v-for="e of v$.name?.$errors"
              :key="e.$uid"
              class="mt-1 text-xs text-red-400"
            >
              {{ e.$message }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block mb-2 text-xs font-semibold tracking-widest uppercase md:text-sm text-white/80"
            >
              Email
              <span class="text-pink">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              v-model="formState.email"
              :aria-invalid="v$.email?.$error || null"
              class="w-full rounded-xl px-3.5 py-3 bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-pink focus:ring-2 focus:ring-pink/40 outline-none transition"
              placeholder="you@email.com"
              :class="{ 'border-red-500 focus:ring-red-400': v$.email?.$error }"
            />
            <p
              v-for="e of v$.email?.$errors"
              :key="e.$uid"
              class="mt-1 text-xs text-red-400"
            >
              {{ e.$message }}
            </p>
          </div>

          <!-- Phone -->
          <div>
            <label
              for="phone"
              class="block mb-2 text-xs font-semibold tracking-widest uppercase md:text-sm text-white/80"
            >
              Phone
              <span class="text-pink">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              v-model="formState.phone"
              :aria-invalid="v$.phone?.$error || null"
              class="w-full rounded-xl px-3.5 py-3 bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-pink focus:ring-2 focus:ring-pink/40 outline-none transition"
              placeholder="(555) 123-4567"
              :class="{ 'border-red-500 focus:ring-red-400': v$.phone?.$error }"
            />
            <p
              v-for="e of v$.phone?.$errors"
              :key="e.$uid"
              class="mt-1 text-xs text-red-400"
            >
              {{ e.$message }}
            </p>
          </div>

          <!-- Subject -->
          <div>
            <label
              for="subject"
              class="block mb-2 text-xs font-semibold tracking-widest uppercase md:text-sm text-white/80"
            >
              Subject
              <span class="text-pink">*</span>
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              v-model="formState.subject"
              :aria-invalid="v$.subject?.$error || null"
              class="w-full rounded-xl px-3.5 py-3 bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-pink focus:ring-2 focus:ring-pink/40 outline-none transition"
              placeholder="Booking / Availability"
              :class="{
                'border-red-500 focus:ring-red-400': v$.subject?.$error
              }"
            />
            <p
              v-for="e of v$.subject?.$errors"
              :key="e.$uid"
              class="mt-1 text-xs text-red-400"
            >
              {{ e.$message }}
            </p>
          </div>

          <!-- Message (full width) -->
          <div class="md:col-span-2">
            <label
              for="message"
              class="block mb-2 text-xs font-semibold tracking-widest uppercase md:text-sm text-white/80"
            >
              Message
              <span class="text-pink">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              v-model="formState.message"
              :aria-invalid="v$.message?.$error || null"
              class="w-full rounded-xl px-3.5 py-3 bg-white/5 text-white placeholder-white/40 border border-white/10 focus:border-pink focus:ring-2 focus:ring-pink/40 outline-none transition resize-y"
              placeholder="Tell us about your event…"
              :class="{
                'border-red-500 focus:ring-red-400': v$.message?.$error
              }"
            ></textarea>
            <p
              v-for="e of v$.message?.$errors"
              :key="e.$uid"
              class="mt-1 text-xs text-red-400"
            >
              {{ e.$message }}
            </p>
          </div>
        </div>

        <!-- CTA (matches site buttons) -->
        <button
          type="submit"
          class="group inline-flex items-center justify-center gap-2 w-full mt-6 px-6 py-3 rounded-full bg-[#F63D7A] text-black font-semibold uppercase tracking-wide shadow-md hover:bg-black hover:text-white transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F63D7A] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          Submit Message
          <svg
            class="size-4 transition-transform group-hover:translate-x-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              d="M12.293 4.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 10H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
            />
          </svg>
        </button>
      </form>
    </div>

    <!-- Success state -->
    <div
      v-else
      class="p-8 text-center border bg-white/5 backdrop-blur-sm border-white/10 rounded-2xl"
    >
      <h2 class="text-2xl font-extrabold text-white md:text-3xl">Thank you!</h2>
      <p class="mt-2 text-white/80">We’ll reach out as soon as possible.</p>
    </div>
  </div>
</template>
