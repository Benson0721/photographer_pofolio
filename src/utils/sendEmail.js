import emailjs from "@emailjs/browser";

const EMAILJS_SERVICE_ID = "service_zus6nig";
const EMAILJS_TEMPLATE_ID = "template_kzv5rbv";
const EMAILJS_USER_ID = "vkXwHwAPV2buEf4Sp";

export const sendEmail = async (data) => {
  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        subject: data.subject,
        name: data.name,
        message: data.message,
        email: data.email,
      },
      EMAILJS_USER_ID
    );
    return { message: "成功寄出郵件" };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { error: "寄出郵件失敗" };
  }
};
