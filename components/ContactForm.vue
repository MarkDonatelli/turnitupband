<script setup>
  import {
    EVENT_TYPES,
    FIELD_ORDER,
    LIMITS,
    fieldError,
    isoToday,
    normalizeBooking,
    validateBooking
  } from '~/utils/booking.mjs';

  // ---------------------------------------------------------------------------
  // Event types. The labels and rules live in utils/booking.mjs, shared with
  // the server. Notes are short and make no promises about pricing, packages
  // or response times.
  // ---------------------------------------------------------------------------
  const copy = {
    Wedding: { venuePh: 'Venue name or town', note: 'Tell us about your wedding, and we’ll check availability.' },
    Corporate: { venuePh: 'Company, venue or town', note: 'Planning an event? Tell us what you have in mind.' },
    'Private party': { venuePh: 'Home, hall or venue', note: 'Tell us what you’re celebrating.' },
    'Bar / venue': { venuePh: 'Venue name and town', note: 'Looking to book Turn It Up? Send us the details.' },
    'Something else': { venuePh: 'Where is it?', note: 'Have something different in mind? We’d love to hear about it.' }
  };
  const eventTypes = EVENT_TYPES.map(label => ({ label, ...copy[label] }));

  // Shared page state so event-specific links (Events section) can preselect
  // it. Only those links and the radio buttons below change it.
  const eventType = useState('contact-event-type', () => 'Wedding');
  const current = computed(() => eventTypes.find(e => e.label === eventType.value) || eventTypes[0]);

  const blank = () => ({ date: '', venue: '', name: '', email: '', phone: '', message: '' });
  const formState = reactive(blank());
  const botField = ref(''); // honeypot: people never see it, bots fill it

  // A half-typed date reports an empty value but sets validity.badInput.
  const dateIncomplete = ref(false);

  // ---------------------------------------------------------------------------
  // Validation: computed live from the shared rules. What's *shown* is gated:
  //  - nothing on load;
  //  - a field shows its error once it has been left (blurred) or on submit;
  //  - while someone types into a field that had no error, nothing new flashes;
  //  - an error already showing updates live, so it clears the moment it's fixed.
  // ---------------------------------------------------------------------------
  const data = computed(() => ({ eventType: eventType.value, ...formState }));
  const result = computed(() => validateBooking(data.value, { today: isoToday(), dateIncomplete: dateIncomplete.value }));

  const touched = reactive({});
  const focused = ref(null);
  const errorWhenFocused = ref(false);

  const errorFor = name => result.value.errors[name] || '';
  const showError = name =>
    !!touched[name] && !!errorFor(name) && (focused.value !== name || errorWhenFocused.value);

  const onFocus = name => {
    focused.value = name;
    errorWhenFocused.value = showError(name) || (!!touched[name] && !!errorFor(name));
  };
  const onBlur = name => {
    focused.value = null;
    touched[name] = true;
  };
  const onDateInput = e => (dateIncomplete.value = e.target.validity.badInput);

  const describedBy = name => (showError(name) ? `cf-${name}-error` : undefined);

  // The date picker starts at today. Set after mount so server and browser
  // render the same HTML.
  const minDate = ref('');
  onMounted(() => (minDate.value = isoToday()));

  // "Check your date" only when there is a date to check.
  const ctaLabel = computed(() => (formState.date ? 'Check your date' : 'Send inquiry'));

  // ---------------------------------------------------------------------------
  // Submit
  // idle → sending → sent | error. `preview`: valid, but not sent, because
  // this build isn't the production site.
  // ---------------------------------------------------------------------------
  const status = ref('idle');
  const { deployContext } = useRuntimeConfig().public;
  const isPreview = deployContext !== 'production';

  const announcement = ref(''); // read out once by screen readers on a failed submit
  const successHeading = ref(null);

  const focusField = name =>
    (name === 'eventType'
      ? document.querySelector('#contact input[name="eventType"]')
      : document.getElementById(`cf-${name}`)
    )?.focus();

  // Set synchronously on the first click, so rapid repeat clicks can't each
  // pass the check while the first is still in progress.
  let busy = false;
  const handleSubmit = async () => {
    if (busy) return;
    busy = true;
    try {
      await submitOnce();
    } finally {
      busy = false;
    }
  };

  const submitOnce = async () => {
    status.value = 'idle'; // clear an earlier failure or preview notice
    FIELD_ORDER.forEach(name => (touched[name] = true));
    focused.value = null;

    const { valid, errors } = result.value;
    if (!valid) {
      const bad = FIELD_ORDER.filter(name => errors[name]);
      announcement.value = '';
      await nextTick();
      announcement.value = `${bad.length === 1 ? 'One field needs' : `${bad.length} fields need`} attention.`;
      focusField(bad[0]);
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
      // Sent from the validated, trimmed values rather than raw DOM values.
      const body = new URLSearchParams({
        'form-name': 'contact-form',
        'bot-field': botField.value,
        ...normalizeBooking(data.value)
      });
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      // Success only once Netlify confirms it stored the inquiry.
      if (!res.ok) throw new Error(`Form POST failed: ${res.status}`);
      status.value = 'sent';
      Object.assign(formState, blank());
      Object.keys(touched).forEach(k => delete touched[k]);
      await nextTick();
      successHeading.value?.focus();
    } catch (error) {
      console.error(error);
      // Keep everything typed so they can retry.
      status.value = 'error';
    }
  };

  // ---------------------------------------------------------------------------
  // Fields and classes
  // ---------------------------------------------------------------------------
  const contactFields = [
    { name: 'name', label: 'Your name', type: 'text', autocomplete: 'name', placeholder: 'First and last name', required: true, maxlength: LIMITS.name },
    { name: 'email', label: 'Email', type: 'email', autocomplete: 'email', inputmode: 'email', placeholder: 'you@example.com', required: true, maxlength: LIMITS.email },
    { name: 'phone', label: 'Phone', type: 'tel', autocomplete: 'tel', inputmode: 'tel', placeholder: 'Best number to reach you', maxlength: LIMITS.phone }
  ];

  const shadow = '[text-shadow:0_0_2px_#17161C,0_0_8px_#17161C,0_0_14px_#17161C]';
  const labelClass = `block px-5 pb-1.5 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-muted ${shadow}`;
  const optionalClass = 'normal-case tracking-normal text-muted2';
  const errorClass = `mt-1.5 px-5 text-left text-xs font-semibold text-pink ${shadow}`;
  // scroll-mt keeps a focused field clear of the fixed header.
  const field =
    'w-full scroll-mt-[120px] rounded-full px-5 h-[52px] bg-ivory text-ink placeholder-stone border-0 outline-none focus:ring-2 focus:ring-pink';
  const invalid = 'ring-2 ring-pink';
</script>

<template>
  <div class="w-full max-w-[760px]">
    <form
      v-if="status !== 'sent'"
      action="/"
      method="POST"
      name="contact-form"
      netlify
      netlify-honeypot="bot-field"
      novalidate
      class="flex flex-col items-center gap-5"
      :aria-busy="status === 'sending' ? 'true' : undefined"
      @submit.prevent="handleSubmit"
    >
      <input type="hidden" name="form-name" value="contact-form" />
      <!-- Honeypot: off-screen, out of the tab order and hidden from assistive tech -->
      <div class="absolute -left-[9999px] size-px overflow-hidden" aria-hidden="true">
        <label>Leave this empty <input v-model="botField" name="bot-field" tabindex="-1" autocomplete="off" /></label>
      </div>

      <!-- Event type: native radios (arrow keys move between them) styled as pills -->
      <fieldset :aria-describedby="describedBy('eventType')">
        <legend class="sr-only">Event type</legend>
        <div class="flex flex-wrap justify-center gap-2 md:gap-2.5">
          <label v-for="e in eventTypes" :key="e.label" class="relative cursor-pointer">
            <input
              v-model="eventType"
              type="radio"
              name="eventType"
              :value="e.label"
              class="peer absolute inset-0 size-full cursor-pointer opacity-0 scroll-mt-[120px]"
            />
            <span
              class="flex min-h-[44px] items-center rounded-full border px-[18px] text-sm font-semibold transition-colors md:min-h-[46px] md:px-[22px] md:text-[15px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ivory"
              :class="eventType === e.label ? 'border-pink bg-pink text-ink' : 'border-ivory/45 text-ivory hover:border-pink'"
              >{{ e.label }}</span
            >
          </label>
        </div>
        <p v-if="showError('eventType')" id="cf-eventType-error" :class="errorClass" class="text-center">
          {{ errorFor('eventType') }}
        </p>
      </fieldset>

      <p class="-mt-1 text-sm text-ivory">{{ current.note }} Fields marked * are required.</p>

      <div class="grid w-full gap-x-2.5 gap-y-4 md:grid-cols-2">
        <!-- Event date: the browser's own date picker. iOS Safari gives date
             inputs an intrinsic min-width that ignores w-full, so the input
             drops native appearance and both it and its grid cell may shrink. -->
        <div class="min-w-0">
          <label for="cf-date" :class="labelClass">
            Event date <span :class="optionalClass">(optional)</span>
          </label>
          <input
            id="cf-date"
            v-model="formState.date"
            name="date"
            type="date"
            :min="minDate || undefined"
            :class="[field, 'block min-w-0 max-w-full appearance-none [&::-webkit-date-and-time-value]:text-left', showError('date') && invalid]"
            :aria-invalid="showError('date') ? 'true' : undefined"
            :aria-describedby="describedBy('date')"
            @input="onDateInput"
            @change="onDateInput"
            @focus="onFocus('date')"
            @blur="onDateInput($event), onBlur('date')"
          />
          <p v-if="showError('date')" id="cf-date-error" :class="errorClass">{{ errorFor('date') }}</p>
        </div>

        <div>
          <label for="cf-venue" :class="labelClass">
            Venue or town <span :class="optionalClass">(optional)</span>
          </label>
          <input
            id="cf-venue"
            v-model="formState.venue"
            name="venue"
            type="text"
            :maxlength="LIMITS.venue"
            :class="[field, showError('venue') && invalid]"
            :placeholder="current.venuePh"
            :aria-invalid="showError('venue') ? 'true' : undefined"
            :aria-describedby="describedBy('venue')"
            @focus="onFocus('venue')"
            @blur="onBlur('venue')"
          />
          <p v-if="showError('venue')" id="cf-venue-error" :class="errorClass">{{ errorFor('venue') }}</p>
        </div>

        <div v-for="f in contactFields" :key="f.name" :class="f.name === 'phone' && 'md:col-span-2'">
          <label :for="`cf-${f.name}`" :class="labelClass">
            {{ f.label }}<span v-if="f.required" class="text-pink" aria-hidden="true"> *</span>
            <span v-else :class="optionalClass"> (optional)</span>
          </label>
          <input
            :id="`cf-${f.name}`"
            v-model="formState[f.name]"
            :name="f.name"
            :type="f.type"
            :autocomplete="f.autocomplete"
            :inputmode="f.inputmode"
            :maxlength="f.maxlength"
            :class="[field, showError(f.name) && invalid]"
            :placeholder="f.placeholder"
            :aria-required="f.required ? 'true' : undefined"
            :aria-invalid="showError(f.name) ? 'true' : undefined"
            :aria-describedby="describedBy(f.name)"
            @focus="onFocus(f.name)"
            @blur="onBlur(f.name)"
          />
          <p v-if="showError(f.name)" :id="`cf-${f.name}-error`" :class="errorClass">{{ errorFor(f.name) }}</p>
        </div>

        <div class="md:col-span-2">
          <label for="cf-message" :class="labelClass">
            Additional details<span class="text-pink" aria-hidden="true"> *</span>
          </label>
          <textarea
            id="cf-message"
            v-model="formState.message"
            name="message"
            rows="4"
            :maxlength="LIMITS.message"
            class="w-full scroll-mt-[120px] resize-y rounded-3xl bg-ivory px-5 py-4 text-ink placeholder-stone outline-none focus:ring-2 focus:ring-pink"
            :class="showError('message') && invalid"
            placeholder="Tell us about your event, guest count, favorite songs, or anything else we should know."
            aria-required="true"
            :aria-invalid="showError('message') ? 'true' : undefined"
            :aria-describedby="describedBy('message')"
            @focus="onFocus('message')"
            @blur="onBlur('message')"
          ></textarea>
          <p v-if="showError('message')" id="cf-message-error" :class="errorClass">{{ errorFor('message') }}</p>
        </div>
      </div>

      <button
        type="submit"
        :disabled="status === 'sending'"
        class="h-[56px] w-full rounded-full bg-pink px-7 text-[15px] font-bold text-ink transition-colors hover:bg-ivory focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ivory disabled:cursor-wait disabled:opacity-70 md:w-auto"
      >
        {{ status === 'sending' ? 'Sending…' : ctaLabel }}
      </button>

      <!-- Read out on a failed submit; focus also moves to the first problem -->
      <p class="sr-only" aria-live="polite">{{ announcement }}</p>

      <p
        v-if="status === 'error'"
        role="alert"
        class="max-w-[520px] rounded-2xl bg-ink2 px-5 py-3 text-sm text-pink"
      >
        Something went wrong. Your message wasn’t sent. Please try again, or message us on
        <a href="https://www.instagram.com/turnitupband/" target="_blank" rel="noopener" class="underline underline-offset-2"
          >Instagram</a
        >.
      </p>
      <p
        v-else-if="status === 'preview'"
        role="status"
        class="max-w-[520px] rounded-2xl border border-ivory/25 bg-ink2 px-5 py-3 text-sm text-ivory"
      >
        Preview build: the form checks out, but nothing was sent. Inquiries only go to the band from the
        live site.
      </p>
    </form>

    <div v-else role="status" class="flex flex-col items-center gap-3 py-8">
      <h3 ref="successHeading" tabindex="-1" class="font-serif text-[32px] outline-none md:text-[40px]">
        You’re on our radar!
      </h3>
      <p class="max-w-[440px] text-muted">
        Thanks for reaching out to Turn It Up. We received your inquiry and will be in touch.
      </p>
    </div>
  </div>
</template>
