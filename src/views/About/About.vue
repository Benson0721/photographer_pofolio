<script setup lang="ts">
import "./About.scss";
import {
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
import Handing from "../../components/Handing.vue";
import SocialMediaButtons from "../../components/SocialMediaButtons.vue";
import AboutDialog from "../../components/ImageSystem/AboutDialog/AboutDialog.vue";
import { AboutImage } from "../../types/apiType";
import { useAboutStore } from "../../stores/aboutPinia";
import { useWindowSize } from "../../utils/useWindowSize";
import { useImageSizeList } from "../../utils/useImageSizeList";
import { sendEmail } from "../../utils/sendEmail";
const { imageRefs, imageSizes, updateSizes } = useImageSizeList();

const { device } = useWindowSize();
const route = useRoute();
const aboutStore = useAboutStore();
const formData = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const title = ref("About");
const isLoading = ref(false);
const isEmailSending = ref(false);
const loadingmessage = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const HeadingStyle = ref(
  "mt-4 text-[36px] md:text-[72px] lg:text-[96px] font-playfair text-white text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
);

const isScrolledPast = ref(false);
const isSocialScrolledPast = ref(false);
const isAboutPastScroll = ref(false);
const isContactPastScroll = ref(false);

const imageMap = computed(() => {
  const result: Record<string, AboutImage> = {};
  const targets = ["about", "pai", "moto"];
  targets.forEach((title) => {
    const image = aboutStore.aboutImages.find(
      (img) => img.displayName === title
    );
    if (image) {
      result[title] = image;
    }
  });
  return result;
});

const backgroundStyle = computed(() => {
  if (device.value !== "mobile") {
    return {
      backgroundImage: `url(${imageMap.value["about"]?.imageURL})`,
    };
  }
  return {};
});

const handleSubmit = async (data: any) => {
  try {
    isEmailSending.value = true;
    loadingmessage.value = "正在寄出信件...";
    if (!data.name || !data.email || !data.subject || !data.message) {
      throw new Error("請填寫完整表單");
    }
    const res = await sendEmail(data);
    successMessage.value = res.message;
    clearForm();
    setTimeout(() => {
      clearMessage();
    }, 5000);

    isEmailSending.value = false;
  } catch (error: any) {
    errorMessage.value = error.message;
    setTimeout(() => {
      clearMessage();
    }, 5000);
    isEmailSending.value = false;
  }
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
const clearForm = () => {
  formData.name = "";
  formData.email = "";
  formData.subject = "";
  formData.message = "";
};
const clearMessage = () => {
  successMessage.value = "";
  errorMessage.value = "";
};
onMounted(async () => {
  await aboutStore.fetchImages();
  await nextTick(() => {
    observerFunc();
    socialFunc();
    updateSizes();
  });
  isLoading.value = false;
  if (route.hash) {
    console.log("coming from hash");
    scrollFunc(route.hash);
  }
});
</script>
<template #default="{ state: { valid } }">
  <div
    v-if="isLoading"
    class="absolute inset-0 flex flex-col justify-center items-center bg-white z-10"
  >
    <div
      class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-12 h-12 animate-spin"
    ></div>
    <p class="mt-2 text-gray-500 text-sm">網站加載中...</p>
  </div>
  <main v-else class="about__bg transition" :style="backgroundStyle">
    <Navbar :isScrolledPast="isScrolledPast" />
    <div class="about__banner">
      <img
        v-if="device === 'mobile'"
        :src="imageMap['about']?.imageURL"
        :ref="(el) => (imageRefs['about'] = el)"
        alt="about"
        class="w-full h-auto object-cover md:hidden"
      />
      <Handing v-model:title="title" :HeadingStyle="HeadingStyle" />
      <AboutDialog
        :url="imageMap['about']?.imageURL"
        :publicID="imageMap['about']?.public_id"
        :id="imageMap['about']?._id"
        :width="imageSizes['about']?.width"
        :height="imageSizes['about']?.height"
      />
    </div>
    <div class="bg-amber-50">
      <div class="about" id="about">
        <div
          class="about__pai h-[250px] md:h-full relative mt-5"
          :class="{ 'fade-controller': isAboutPastScroll }"
        >
          <img
            :src="imageMap['pai']?.imageURL"
            alt="攝影師帥哥本人"
            class="w-full h-full object-cover object-[0%_30%]"
            :ref="(el) => (imageRefs['pai'] = el)"
          />
          <AboutDialog
            :url="imageMap['pai']?.imageURL"
            :publicID="imageMap['pai']?.public_id"
            :id="imageMap['pai']?._id"
            :width="imageSizes['pai']?.width"
            :height="imageSizes['pai']?.height"
          />
        </div>
        <div
          class="about__content"
          :class="{ 'fade-controller': isAboutPastScroll }"
        >
          <div
            class="px-4 h-full text-[1rem] md:text-[1.03rem] lg:text-[1.75rem] text-black font-noto"
          >
            <h2
              class="text-[48px] md:text-[72px] font-playfair text-black text-center"
            >
              Me
            </h2>
            <div class="my-4 md:my-8 lg:my-8">
              我是白承智，一位專注於人像、街拍、風景與建築攝影的創作者。
            </div>
            <div>喜歡以機車旅行的方式探索城市與自然，</div>
            <div>將每段路途中的片刻，以影像記錄下來。</div>
            <div class="my-4 md:my-8 lg:my-18">
              我的攝影風格注重光影與情緒，致力於捕捉被攝者最自然的狀態，同時也關注城市脈動與空間構造所呈現的美學。
            </div>
            <div class="my-4 md:my-8 lg:my-18">
              若你對我的影像有共鳴，或希望合作拍攝，歡迎與我聯繫。
            </div>
          </div>
        </div>
        <div class="about__whitespace"></div>
      </div>
      <div class="flex flex-col md:flex-row mt-4" id="contact">
        <div
          class="relative h-[250px] md:h-full md:order-2 md:flex-2/5"
          :class="{ 'fade-controller': isContactPastScroll }"
        >
          <img
            :src="imageMap['moto']?.imageURL"
            alt="moto"
            class="w-full h-full object-cover object-[0%_40%]"
            :ref="(el) => (imageRefs['moto'] = el)"
          />
          <AboutDialog
            :url="imageMap['moto']?.imageURL"
            :publicID="imageMap['moto']?.public_id"
            :id="imageMap['moto']?._id"
            :width="imageSizes['moto']?.width"
            :height="imageSizes['moto']?.height"
          />
        </div>
        <div
          class="flex flex-col items-center p-4 md:p-8 lg:p-12 relative md:flex-3/5 md:order-1"
          :class="{ 'fade-controller': isContactPastScroll }"
        >
          <h2
            class="mb-16 text-[48px] md:text-[72px] font-playfair text-black text-center"
          >
            Contact
          </h2>
          <div
            v-if="isEmailSending"
            class="flex items-center absolute sm:top-1/7 md:top-1/5"
          >
            <div
              class="spinner border-4 border-gray-200 border-t-blue-500 rounded-full w-5 h-5 animate-spin"
            ></div>
            <span class="ml-2 text-gray-500 text-sm">{{ loadingmessage }}</span>
          </div>
          <div class="absolute sm:top-1/7 md:top-1/5 text-green-500">
            {{ successMessage }}
          </div>
          <div
            v-if="errorMessage"
            class="absolute sm:top-1/7 md:top-1/5 text-red-500"
          >
            {{ errorMessage }}
          </div>
          <FormKit
            type="form"
            :actions="false"
            @submit="handleSubmit"
            outerClass="w-full"
            validation="required"
            :validation-visibility="'submit'"
            incomplete-message="請填寫完必要資訊以送出信件"
            messages-class="text-red-500 text-lg absolute sm:top-1/5 md:top-1/5"
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
                messages-class="text-red-500 text-sm"
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
                messages-class="text-red-500 text-sm"
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
                messages-class="text-red-500 text-sm"
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
                rows="5"
                cols="30"
                messages-class="text-red-500 text-sm"
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
