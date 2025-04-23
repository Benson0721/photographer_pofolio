import { defineFormKitConfig } from "@formkit/vue";
import { rootClasses } from "./formkit.theme.mjs";
import { createAutoHeightTextareaPlugin } from "@formkit/addons";

export default defineFormKitConfig({
  plugins: [createAutoHeightTextareaPlugin()],
  config: {
    rootClasses,
  },
});
