<script setup>
import { reactive } from "vue";
import { useUserStore } from "../../stores/userPinia";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const formData = reactive({
  username: "",
  password: "",
});

const handleSubmit = async (data) => {
  console.log(data);
  userStore.register(data);
  router.push("/login");
};
</script>
<template>
  <div>
    <FormKit
      type="form"
      :actions="false"
      @submit="handleSubmit"
      outerClass="w-full"
      validation="required"
      :validation-visibility="'submit'"
      incomplete-message="請填寫完必要資訊以註冊"
      messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/4"
    >
      <div class="flex flex-col md:flex-row">
        <FormKit
          v-model="formData.username"
          type="text"
          name="username"
          label="username"
          outerClass="mb-4 md:mr-8 w-full md:w-1/2"
          innerClass="mt-4 border-b-2 border-black"
          labelClass=" font-noto "
          validation="required"
          messages-class="text-red-500 text-sm"
          :validation-messages="{
            required: 'please input username',
          }"
          :classes="{
            outer: '',
            inner: 'mt-4 border-b-2',
            input: 'w-full border-none bg-transparent focus:outline-none',
            inputInvalid: 'border-red-500', // 加紅線
          }"
        />
        <FormKit
          v-model="formData.password"
          type="password"
          name="password"
          label="Password"
          outerClass="mb-4 w-full md:w-1/2"
          innerClass="mt-4 border-b-2 border-black"
          labelClass="text-black font-noto "
          validation="required|"
          messages-class="text-red-500 text-sm"
          :validation-messages="{
            required: 'please input password',
            min: 'password must be at least 6 characters',
          }"
          :classes="{
            outer: '',
            inner: 'mt-4 border-b-2',
            input: 'w-full border-none bg-transparent focus:outline-none',
            inputInvalid: 'border-red-500', // 加紅線
          }"
        />
      </div>
      <FormKit
        type="submit"
        label="註冊"
        :classes="{
          outer: 'my-8 text-center',
          input:
            'bg-gray-300 text-black font-semibold py-2 px-16 rounded hover:bg-gray-400 transition duration-300',
        }"
      />
    </FormKit>
  </div>
</template>
<style scoped></style>
