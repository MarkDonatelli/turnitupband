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

  // idle → sending → sent | error. `preview` = validated but not sent,
  // because this build isn't the production site.
  const status = ref('idle');
  const { deployContext } = useRuntimeConfig().public;
  const isPreview = deployContext !== 'production';

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
    if (status.value === 'sending') return;
    await v$.value.$validate();
    if (v$.value.$error) {
      // Send keyboard and screen-reader users straight to the first problem.
      const first = contactFields.find(f => v$.value[f.name].$error);
      if (first) document.getElementById(`cf-${first.name}`)?.focus();
      return;
    }

    // Previews and branch deploys share the production Netlify form, so a
    // test inquiry would land in the band's inbox. Stop here instead.
    if (isPreview) {
      status.value = 'preview';
      return;
    }

    status.value = 'sending';
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(event.target)).toString()
      });
      if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);
      status.value = 'sent';
    } catch (error) {
      console.error(error);
      // Keep the form and everything typed into it so they can retry.
      status.value = 'error';
    }
  };

  const contactFields = [
    { name: 'name', label: 'Your name', type: 'text', autocomplete: 'name', placeholder: 'First and last name', required: true },
    { name: 'email', label: 'Email', type: 'email', autocomplete: 'email', inputmode: 'email', placeholder: 'you@example.com', required: true },
    { name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', inputmode: 'tel', placeholder: 'Best number to reach you' }
  ];

  const labelClass =
    'block px-5 pb-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted [text-shadow:0_0_2px_#17161C,0_0_8px_#17161C,0_0_14px_#17161C]';

  const field =
    'w-full rounded-full px-5 h-[52px] bg-ivory text-ink placeholder-stone border-0 outline-none focus:ring-2 focus:ring-pink';
</script>

<template>
  <div class="w-full max-w-[760px]">
    <form
      v-if="status !== 'sent'"
      @submit="handleValidation"
      action="/"
      method="POST"
      name="contact-form"
      netlify
      netlify-honeypot="bot-field"
      novalidate
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

      <div class="grid w-full gap-x-2.5 gap-y-4 md:grid-cols-2">
        <div>
          <label for="cf-date" :class="labelClass">Event date</label>
          <input id="cf-date" name="date" type="text" v-model="formState.date" :class="field" placeholder="Pick a date" onfocus="this.type='date'" />
        </div>
        <div>
          <label for="cf-venue" :class="labelClass">Venue</label>
          <input id="cf-venue" name="venue" type="text" v-model="formState.venue" :class="field" :placeholder="current.venuePh" />
        </div>
        <div
          v-for="f in contactFields"
          :key="f.name"
          :class="f.name === 'phone' && 'md:col-span-2'"
        >
          <label :for="`cf-${f.name}`" :class="labelClass">
            {{ f.label }}<span v-if="f.required" class="text-pink" aria-hidden="true"> *</span>
            <span v-else class="normal-case tracking-normal text-muted2/80"> (optional)</span>
          </label>
          <input
            :id="`cf-${f.name}`"
            :name="f.name"
            :type="f.type"
            :autocomplete="f.autocomplete"
            :inputmode="f.inputmode"
            v-model="formState[f.name]"
            :class="field"
            :placeholder="f.placeholder"
            :aria-required="f.required ? 'true' : undefined"
            :aria-invalid="v$[f.name].$error ? 'true' : undefined"
            :aria-describedby="v$[f.name].$error ? `cf-${f.name}-error` : undefined"
          />
          <p
            v-if="v$[f.name].$error"
            :id="`cf-${f.name}-error`"
            class="mt-1.5 px-5 text-left text-xs font-semibold text-pink [text-shadow:0_0_2px_#17161C,0_0_8px_#17161C,0_0_14px_#17161C]"
          >
            {{ v$[f.name].$errors[0].$message }}
          </p>
        </div>
        <div class="md:col-span-2">
          <label for="cf-message" :class="labelClass">Anything else?</label>
          <textarea
            id="cf-message"
            name="message"
            rows="4"
            v-model="formState.message"
            class="w-full rounded-3xl px-5 py-4 bg-ivory text-ink placeholder-stone outline-none focus:ring-2 focus:ring-pink resize-y"
            placeholder="Headcount, timeline, must-play songs…"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        :disabled="status === 'sending'"
        class="w-full md:w-auto px-7 h-[56px] rounded-full bg-pink text-ink text-[15px] font-bold hover:bg-ivory transition-colors disabled:cursor-wait disabled:opacity-70"
      >
        {{ status === 'sending' ? 'Sending…' : current.cta }}
      </button>

      <p v-if="status === 'error'" role="alert" class="max-w-[520px] rounded-2xl bg-ink2 px-5 py-3 text-sm text-pink">
        Sorry, that didn’t send. Your details are still here, so please try again, or
        message us on
        <a
          href="https://www.instagram.com/turnitupband/"
          target="_blank"
          rel="noopener"
          class="underline underline-offset-2"
          >Instagram</a
        >.
      </p>
      <p
        v-else-if="status === 'preview'"
        role="status"
        class="max-w-[520px] rounded-2xl border border-ivory/25 bg-ink2 px-5 py-3 text-sm text-ivory"
      >
        Preview build: the form checks out, but nothing was sent. Inquiries only go
        to the band from the live site.
      </p>
      <p class="text-sm text-muted2 max-w-[520px]">{{ current.note }}</p>
    </form>

    <div v-else role="status" class="flex flex-col items-center gap-2 py-8">
      <h3 class="font-serif text-[32px]">Thank you!</h3>
      <p class="text-muted">We’ll get back to you within one business day.</p>
    </div>
  </div>
</template>
