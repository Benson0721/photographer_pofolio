<script setup lang="ts">
import "./About.scss";
import {
  defineProps,
  ref,
  onMounted,
  onBeforeUnmount,
  reactive,
  nextTick,
  computed,
} from "vue";
import { useRoute } from "vue-router";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import { FormKit } from "@formkit/vue";
import emailjs from "@emailjs/browser";
import Handing from "../../components/Handing.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";

import { getImages } from "../../apis/OtherImage_Api.js";
import { Image } from "../../types/apiType";

const formData = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const props = defineProps<{
  isDesktop: boolean;
}>();

const title = ref("About");
const isLoading = ref(true);
const aboutImages = ref<Image[]>([]);

const HeadingStyle = ref(
  "mt-4 text-[48px] md:text-[72px] lg:text-[96px] font-playfair text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
);

const route = useRoute();
const isScrolledPast = ref(false);
const isSocialScrolledPast = ref(false);
const isAboutPastScroll = ref(false);
const isContactPastScroll = ref(false);

const backgroundStyle = computed(() => {
  if (props.isDesktop) {
    return {
      backgroundImage: `url(${
        aboutImages.value.find((img) => img.title === "about")?.url
      })`,
    };
  }
  return {};
});

const handleSubmit = async (data: any) => {
  const response = await emailjs.send(
    "service_zus6nig",
    "template_kzv5rbv",
    {
      subject: data.subject,
      name: data.name,
      message: data.message,
      email: data.email,
    },
    "vkXwHwAPV2buEf4Sp"
  );
  console.log(response);
};
const observerFunc = () => {
  const contactSection = document.querySelector("#contact");
  const aboutSection = document.querySelector("#about");
  if (!contactSection || !aboutSection) return;

  const AboutObserver = new IntersectionObserver(
    ([entry]) => {
      isAboutPastScroll.value = entry.isIntersecting;
    },
    {
      threshold: 0.05,
    }
  );
  const ContactObserver = new IntersectionObserver(
    ([entry]) => {
      isContactPastScroll.value = entry.isIntersecting;
    },
    {
      threshold: 0.1,
    }
  );

  AboutObserver.observe(aboutSection);
  ContactObserver.observe(contactSection);

  onBeforeUnmount(() => {
    AboutObserver.disconnect();
    ContactObserver.disconnect();
  });
};
const socialFunc = () => {
  const navbar = document.querySelector(".navbar");
  const aboutSection = document.querySelector("#about");
  const socialMediaButtons = document.querySelector(".social-media-buttons");

  const handleSocialMediaScroll = () => {
    if (!socialMediaButtons || !aboutSection) return;

    const socialRect = socialMediaButtons.getBoundingClientRect();
    const aboutRect = aboutSection.getBoundingClientRect();

    isSocialScrolledPast.value = socialRect.bottom >= aboutRect.top;
  };

  const handleScroll = () => {
    if (!navbar || !aboutSection) return;

    const navbarRect = navbar.getBoundingClientRect();
    const aboutRect = aboutSection.getBoundingClientRect();

    isScrolledPast.value = navbarRect.bottom >= aboutRect.top;
  };
  const combinedHandler = () => {
    handleScroll();
    handleSocialMediaScroll();
  };
  window.addEventListener("scroll", combinedHandler);
  handleScroll(); // 初始化時檢查

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", combinedHandler);
  });
};
const scrollFunc = (hash: string) => {
  setTimeout(() => {
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, 1000);
};
onMounted(async () => {
  const aboutPath = "about";
  aboutImages.value = await getImages(aboutPath);
  isLoading.value = false;
  await nextTick(() => {
    observerFunc();
    socialFunc();
  });
});

onMounted(() => {
  if (route.hash) {
    console.log("coming from hash");
    scrollFunc(route.hash);
  }
});

console.log(isLoading.value);
console.log(isAboutPastScroll.value);
</script>
<template #default="{ state: { valid } }">
  <div
    v-if="isLoading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white z-10"
  >
    <div
      class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"
    ></div>
    <p class="mt-2 text-gray-500 text-sm">Loading...</p>
  </div>
  <main v-else class="about__bg transition" :style="backgroundStyle">
    <Navbar :isScrolledPast="isScrolledPast" />
    <div class="relative h-auto md:h-screen">
      <img
        v-if="!props.isDesktop"
        :src="aboutImages.find((img) => img.title === 'about--mobile')?.url"
        alt="about"
        class="w-full h-auto object-cover about__image"
      />
      <Handing v-model:title="title" :HeadingStyle="HeadingStyle" />
    </div>
    <div class="bg-amber-50">
      <div class="about" id="about">
        <div
          class="about__pai"
          :class="{ 'fade-controller': isAboutPastScroll }"
        >
          <img
            :src="aboutImages.find((img) => img.title === 'pai')?.url"
            alt="攝影師帥哥本人"
            class="w-full h-full object-cover hidden md:block"
          />
          <img
            :src="aboutImages.find((img) => img.title === 'pai--mobile')?.url"
            alt="攝影師帥哥本人"
            class="w-full h-full object-cover md:hidden"
          />
        </div>
        <div
          class="about__content"
          :class="{ 'fade-controller': isAboutPastScroll }"
        >
          <div
            class="px-4 h-full text-[1rem] md:text-[1.03rem] lg:text-[1.5rem] text-black font-noto"
          >
            <div class="my-4 lg:my-16">
              我是白承智，一位專注於人像、街拍、風景與建築攝影的創作者。
            </div>
            <div>喜歡以機車旅行的方式探索城市與自然，</div>
            <div>將每段路途中的片刻，以影像記錄下來。</div>
            <div class="my-4 lg:my-16">
              我的攝影風格注重光影與情緒，致力於捕捉被攝者最自然的狀態，同時也關注城市脈動與空間構造所呈現的美學。
            </div>
            <div class="my-4 lg:my-16">
              若你對我的影像有共鳴，或希望合作拍攝，歡迎與我聯繫。
            </div>
          </div>
        </div>
        <div class="about__whitespace"></div>
      </div>
      <div class="flex flex-col md:flex-row mt-4" id="contact">
        <div
          class="flex-1/3 md:order-2"
          :class="{ 'fade-controller': isContactPastScroll }"
        >
          <img
            :src="aboutImages.find((img) => img.title === 'moto')?.url"
            alt="moto"
            class="w-full h-full object-cover hidden md:block"
          />
          <img
            :src="aboutImages.find((img) => img.title === 'moto--mobile')?.url"
            alt="moto--mobile"
            class="w-full h-full object-cover md:hidden"
          />
        </div>
        <div
          class="flex flex-col items-center mt-4 p-4 md:p-8 lg:p-12 relative flex-2/3 md:order-1"
          :class="{ 'fade-controller': isContactPastScroll }"
        >
          <h2
            class="mt-4 mb-16 text-[48px] md:text-[72px] font-playfair text-black text-center"
          >
            Contact
          </h2>
          <FormKit
            type="form"
            :actions="false"
            @submit="handleSubmit"
            outerClass="w-full"
            validation="required"
            :validation-visibility="'submit'"
            incomplete-message="請填寫完必要資訊以送出信件"
            messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/4"
          >
            <div class="flex flex-col md:flex-row">
              <FormKit
                v-model="formData.name"
                type="text"
                name="name"
                label="姓名"
                outerClass="mb-4 md:mr-8 w-full md:w-1/2"
                innerClass="mt-4 border-b-2 border-black"
                labelClass=" font-noto "
                validation="required"
                messages-class="text-red-500 text-sm"
                :validation-messages="{
                  required: '請輸入姓名',
                }"
                :classes="{
                  outer: '',
                  inner: 'mt-4 border-b-2',
                  input: 'w-full border-none bg-transparent focus:outline-none',
                  inputInvalid: 'border-red-500', // 加紅線
                }"
              />
              <FormKit
                v-model="formData.email"
                type="email"
                name="email"
                label="Email"
                outerClass="mb-4 w-full md:w-1/2"
                innerClass="mt-4 border-b-2 border-black"
                labelClass="text-black font-noto "
                validation="required"
                messages-class="text-red-500 text-sm"
                :validation-messages="{
                  required: '請輸入正確的 Email 格式',
                }"
                :classes="{
                  outer: '',
                  inner: 'mt-4 border-b-2',
                  input: 'w-full border-none bg-transparent focus:outline-none',
                  inputInvalid: 'border-red-500', // 加紅線
                }"
              />
            </div>
            <div class="flex flex-col md:flex-col">
              <FormKit
                v-model="formData.subject"
                type="text"
                name="subject"
                label="標題"
                outerClass="mb-4 w-full md:w-full"
                innerClass="mt-4 border-b-2 border-black"
                labelClass="text-black font-noto "
                validation="required"
                messages-class="text-red-500 text-sm"
                :validation-messages="{
                  required: '請輸入標題',
                }"
                :classes="{
                  outer: '',
                  inner: 'mt-4 border-b-2',
                  input: 'w-full border-none bg-transparent focus:outline-none',
                  inputInvalid: 'border-red-500', // 加紅線
                }"
              />
              <FormKit
                v-model="formData.message"
                type="textarea"
                name="message"
                label="訊息"
                outerClass="mb-4"
                innerClass="mt-4 border-b-2 border-black"
                labelClass="text-black font-noto"
                validation="required"
                rows="5"
                cols="30"
                messages-class="text-red-500 text-sm"
                :validation-messages="{
                  required: '請輸入訊息',
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
              label="送出"
              :classes="{
                outer: 'my-8 text-center',
                input:
                  'bg-gray-300 text-black font-semibold py-2 px-16 rounded hover:bg-gray-400 transition duration-300',
              }"
            />
          </FormKit>
        </div>
      </div>
    </div>
    <SocialMediaButtons
      :isSocialScrolledPast="isSocialScrolledPast"
      :isLoading="isLoading"
    />
    <Footer />
  </main>
</template>
