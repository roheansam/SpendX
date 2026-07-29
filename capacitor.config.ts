import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.spendx.app",
  appName: "SpendX",
  webDir: "out",
  server: {
    androidScheme: "https",
  },
};

export default config;