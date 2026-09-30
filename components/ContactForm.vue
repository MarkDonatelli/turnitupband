<script setup>
  import { useVuelidate } from '@vuelidate/core';
  import { required, email, helpers } from '@vuelidate/validators';

  const phoneNumberRegex =
    /^\+?([0-9]{1,3})?([-.\s])?((\([0-9]{1,3}\))|[0-9]{1,3})?([-.\s])?([0-9]{1,4})([-.\s])?([0-9]{1,4})([-.\s])?([0-9]{1,9})$/;

  const eventTypes = [
    { label: 'Wedding', cta: 'Check your date', venuePh: 'Venue or town', note: 'We reply within one business day with availability and wedding packages.' },
    { label: 'Corporate', cta: 'Request a quote', venuePh: 'Company + venue', note: 'Send your run of show if you have one. We handle COI and venue paperwork.' },
    { label: 'Private party', cta: 'Check your date', venuePh: 'Home, hall or venue', note: 'Birthdays, anniversaries, reunions, backyard blowouts. Tell us the headcount and space.' },
    { label: 'Bar / venue', cta: 'Send open dates', venuePh: 'Venue name + town', note: 'Talent buyers and bar owners: send your open dates and we’ll send our draw history and rider.' },
    { label: 'Something else', cta: 'Get in touch', venuePh: 'Where is it?', note: 'Fundraisers, festivals, town events. If there’s a dance floor, we’re interested.' }
  ];

  const formState = ref({
    eventType: 'Wedding',
    date: '',
    venue: '',
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const current = computed(
    () => eventTypes.find((e) => e.label === formState.value.eventType) || eventTypes[0]
  );

  const isSubmitted = ref(false);

  const rules = {
    name: { required: helpers.withMessage('Please enter your name', required) },
    email: {
      required: helpers.withMessage('Please enter your email address', required),
      email: helpers.withMessage('Please enter a valid email address', email)
    },
    phone: {
      isPhoneNumberValid: helpers.withMessage(
        'Please enter a valid phone number',
        (v) => !v || phoneNumberRegex.test(v)
      )
    }
  };

  const v$ = useVuelidate(rules, formState);

  const handleValidation = async (event) => {
    event.preventDefault();
    await v$.value.$validate();
    if (v$.value.$error) return;
    const formData = new FormData(event.target);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString()
    })
      .then(() => (isSubmitted.value = true))
      .catch((error) => console.error(error));
  };

  const field =
    'w-full rounded-full px-5 h-[52px] bg-ivory text-ink placeholder-stone border-0 outline-none focus:ring-2 focus:ring-pink';
</script>

<template>
  <div class="w-full max-w-[760px]">
    <form
      v-if="!isSubmitted"
      @submit="handleValidation"
      action="/"
      method="POST"
      name="contact-form"
      netlify
      netlify-honeypot="bot-field"
      class="flex flex-col items-center gap-5"
    >
      <input name="bot-field" type="hidden" />
      <input type="hidden" name="form-name" value="contact-form" />
      <input type="hidden" name="eventType" :value="formState.eventType" />

      <div class="flex flex-wrap justify-center gap-2 md:gap-2.5" role="radiogroup" aria-label="Event type">
        <button
          v-for="e in eventTypes"
          :key="e.label"
          type="button"
          role="radio"
          :aria-checked="formState.eventType === e.label"
          @click="formState.eventType = e.label"
          class="min-h-[44px] md:min-h-[46px] px-[18px] md:px-[22px] rounded-full border text-sm md:text-[15px] font-semibold transition-colors"
          :class="
            formState.eventType === e.label
              ? 'bg-pink border-pink text-ink'
              : 'border-ivory/30 text-ivory hover:border-pink'
          "
        >
          {{ e.label }}
        </button>
      </div>

      <div class="grid w-full gap-2.5 md:grid-cols-2">
        <input name="date" type="text" v-model="formState.date" :class="field" placeholder="Event date" onfocus="this.type='date'" />
        <input name="venue" type="text" v-model="formState.venue" :class="field" :placeholder="current.venuePh" />
        <div>
          <input name="name" type="text" v-model="formState.name" :class="field" placeholder="Your name *" />
          <p v-for="e of v$.name.$errors" :key="e.$uid" class="mt-1 text-xs text-left text-pink px-5">{{ e.$message }}</p>
        </div>
        <div>
          <input name="email" type="email" v-model="formState.email" :class="field" placeholder="Email *" />
          <p v-for="e of v$.email.$errors" :key="e.$uid" class="mt-1 text-xs text-left text-pink px-5">{{ e.$message }}</p>
        </div>
        <div class="md:col-span-2">
          <input name="phone" type="tel" v-model="formState.phone" :class="field" placeholder="Phone (optional)" />
          <p v-for="e of v$.phone.$errors" :key="e.$uid" class="mt-1 text-xs text-left text-pink px-5">{{ e.$message }}</p>
        </div>
        <textarea
          name="message"
          rows="4"
          v-model="formState.message"
          class="md:col-span-2 w-full rounded-3xl px-5 py-4 bg-ivory text-ink placeholder-stone outline-none focus:ring-2 focus:ring-pink resize-y"
          placeholder="Anything else? Headcount, timeline, must-play songs…"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full md:w-auto px-7 h-[56px] rounded-full bg-pink text-ink text-[15px] font-bold hover:bg-ivory transition-colors"
      >
        {{ current.cta }}
      </button>
      <p class="text-sm text-muted2 max-w-[520px]">{{ current.note }}</p>
    </form>

    <div v-else class="flex flex-col items-center gap-2 py-8">
      <h3 class="font-serif text-[32px]">Thank you!</h3>
      <p class="text-muted">We’ll get back to you within one business day.</p>
    </div>
  </div>
</template>
