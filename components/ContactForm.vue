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
  const handleValidation = (event) => {
    event.preventDefault();
    v$.value.$validate();

    if (v$.value.$error) {
      // Prevent form submission
      event.preventDefault();
      // Optionally, focus the first invalid input, display error messages, etc.
    }
    console.log('success', formState.value);
  };
</script>

<template>
  <div class="relative md:max-w-[700px] w-full mx-auto">
    <form
      @submit="handleValidation"
      action="/"
      method="POST"
      name="contact-form"
      netlify
      netlify-honeypot="bot-field"
    >
      <input name="bot-field" type="hidden" />
      <input type="hidden" name="form-name" value="contact-form" />

      <div class="flex flex-col mb-4">
        <label
          class="pb-1 text-sm font-bold text-white md:text-base font-mont"
          for="name"
        >
          Name
          <span class="text-pink">*</span>
        </label>
        <input
          class="p-2 text-white border border-transparent rounded-none outline-none focus:border-pink bg-lightGray font-barlow"
          type="text"
          name="name"
          id="name"
          v-model="formState.name"
        />

        <div>
          <p
            class="mt-1 text-xs text-red-500"
            v-for="error of v$.name.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <div class="flex flex-col mb-4">
        <label
          class="pb-1 text-sm font-bold text-white md:text-base font-mont"
          for="email"
        >
          Email
          <span class="text-pink">*</span>
        </label>
        <input
          class="p-2 text-white border border-transparent rounded-none outline-none focus:border-pink bg-lightGray font-barlow"
          type="text"
          name="email"
          id="email"
          v-model="formState.email"
        />
        <div>
          <p
            class="mt-1 text-xs text-red-500"
            v-for="error of v$.email.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <div class="flex flex-col mb-4">
        <label
          class="pb-1 text-sm font-bold text-white md:text-base font-mont"
          for="phone"
        >
          Phone
          <span class="text-pink">*</span>
        </label>
        <input
          class="p-2 text-white border border-transparent rounded-none outline-none focus:border-pink bg-lightGray font-barlow"
          type="text"
          name="phone"
          id="phone"
          v-model="formState.phone"
        />
        <div>
          <p
            class="mt-1 text-xs text-red-500"
            v-for="error of v$.phone.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <div class="flex flex-col mb-4">
        <label
          class="pb-1 text-sm font-bold text-white md:text-base font-mont"
          for="subject"
        >
          Subject
          <span class="text-pink">*</span>
        </label>
        <input
          class="p-2 text-white border border-transparent rounded-none outline-none focus:border-pink bg-lightGray font-barlow"
          type="text"
          name="subject"
          id="subject"
          v-model="formState.subject"
        />
        <div>
          <p
            class="mt-1 text-xs text-red-500"
            v-for="error of v$.subject.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <div class="flex flex-col mb-4">
        <label
          class="pb-1 text-sm font-bold text-white md:text-base font-mont"
          for="message"
        >
          Message
          <span class="text-pink">*</span>
        </label>
        <textarea
          class="p-2 text-white border border-transparent rounded-none outline-none focus:border-pink bg-lightGray font-barlow"
          v-model="formState.message"
          rows="5"
          id="message"
          placeholder="Message..."
          name="message"
        ></textarea>

        <div>
          <p
            class="mt-1 text-xs text-red-500"
            v-for="error of v$.message.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>
        </div>
      </div>

      <button
        class="relative w-full p-5 mt-5 text-sm font-bold text-white uppercase transition-all duration-200 border border-pink font-mont hover:bg-pink hover:text-white"
        type="submit"
      >
        Submit Message
      </button>
    </form>
  </div>
</template>
