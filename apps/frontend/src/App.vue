<template>
  <div class="form">
    <form @submit.prevent="submit">

    <input v-model="name" type="text" />
    <button type="submit">Send</button>
    </form>
  </div>
  <div v-if="hello" class="hello">
    {{ hello.response }}
  </div>
  <div v-if="error" class="error">
    {{ error }}
  </div>
</template>

<script setup lang="ts">

import { HelloService } from '@/grpc';
import type { HelloMessage } from '@fullstack-monorepo/grpc/hello/hello';
import { ref } from 'vue';

const name = ref<string | undefined>(undefined);
const hello = ref<HelloMessage>();
const error = ref<string | undefined>(undefined);

const submit = async () => {
  try {
    if (!name.value) {
      error.value = 'Name is required';
      return;
    }
    hello.value = await HelloService.sayMeHello({value: name.value!}).response;
    error.value = undefined;
    name.value = undefined;
  } catch (e) {
    error.value = (<Error>e).message;
  }
}

</script>

<style scoped>
.form {
  margin-top: 48px;
  text-align: center;
}

.hello {
  color: darkgreen;
  margin-top: 24px;
  text-align: center;
  font-weight: bold;
}

.error {
  color: red;
  margin-top: 24px;
  text-align: center;
  font-size: 1.2rem;
}


</style>
