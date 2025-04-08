<script setup lang="ts">
import "./About.scss";
import { defineProps, ref, onMounted, onBeforeUnmount } from "vue";
import bioImage from "../../assets/images/pai.jpg";
import bioImage_mobile from "../../assets/images/pai_mobile.jpg";
import Navbar from "../../components/Navbar/Navbar.vue";
import Footer from "../../components/Footer.vue";
import { FormKit } from "@formkit/vue";
import { reactive } from "vue";
import emailjs from "@emailjs/browser";
import about from "../../assets/images/about.png";
import Handing from "../../components/Handing.vue";

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

const HeadingStyle = ref(
  "mt-4 text-[56px] md:text-[72px] lg:text-[96px] font-playfair text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
);

const isScrolledPast = ref(false);

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

onMounted(() => {
  const navbar = document.querySelector(".navbar");
  const aboutSection = document.querySelector("#about");

  const handleScroll = () => {
    if (!navbar || !aboutSection) return;

    const navbarRect = navbar.getBoundingClientRect();
    const aboutRect = aboutSection.getBoundingClientRect();

    isScrolledPast.value = navbarRect.bottom >= aboutRect.top;
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // 初始化時檢查

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", handleScroll);
  });
});

console.log(isScrolledPast.value);
</script>
<template>
  <main class="about__bg" :class="{ 'about__bg--mobile': props.isDesktop }">
    <Navbar :isScrolledPast="isScrolledPast" />
    <div class="relative h-auto md:h-screen">
      <img
        v-if="!props.isDesktop"
        :src="about"
        alt="about"
        class="w-full h-auto object-cover about__image"
      />
      <Handing v-model:title="title" :HeadingStyle="HeadingStyle" />
    </div>
    <div class="about" id="about">
      <div class="about__pai">
        <img
          :src="bioImage"
          alt="bio_image"
          class="w-full h-full object-cover hidden md:block"
        />
        <img
          :src="bioImage_mobile"
          alt="bio_image_mobile"
          class="w-full h-full object-cover md:hidden"
        />
      </div>
      <div class="about__content">
        <h2 class="text-center text-[28px] md:text-[56px] font-playfair my-12">
          關於我
        </h2>
        <div
          class="px-4 h-full text-[16px] md:text-[28px] text-black font-noto"
        >
          <div class="my-8">
            我是白承智，一位專注於人像、街頭、風景與建築攝影的創作者。
          </div>
          <div>喜歡以機車旅行的方式探索城市與自然，</div>
          <div>將每段路途中的片刻，以影像記錄下來。</div>
          <div class="my-8">
            我的攝影風格注重光影與情緒，致力於捕捉被攝者最自然的狀態，同時也關注城市脈動與空間構造所呈現的美學。
          </div>
          <div class="my-12">
            若你對我的影像有共鳴，或希望合作拍攝，歡迎與我聯繫。
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-center mt-8">
      <h2
        class="mt-4 mb-16 text-[48px] md:text-[72px] font-playfair text-black text-center"
      >
        Contact Me
      </h2>
      <FormKit type="form" :actions="false" @submit="handleSubmit">
        <div class="flex flex-col md:flex-row">
          <FormKit
            v-model="formData.name"
            type="text"
            name="name"
            label="姓名"
            outerClass="mb-4 md:mr-8 w-full md:w-1/2"
            innerClass="mt-4 border-b-2 border-black"
            labelClass=" font-noto "
          />
          <FormKit
            v-model="formData.email"
            type="email"
            name="email"
            label="Email"
            outerClass="mb-4 w-full md:w-1/2"
            innerClass="mt-4 border-b-2 border-black"
            labelClass="text-black font-noto "
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
          />
          <FormKit
            v-model="formData.message"
            type="textarea"
            name="message"
            label="訊息"
            outerClass="mb-4"
            innerClass="mt-4 border-b-2 border-black"
            labelClass="text-black font-noto"
            rows="5"
            cols="30"
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
    <Footer />
  </main>
</template>
