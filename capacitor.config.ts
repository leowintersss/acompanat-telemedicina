import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.acompanat.app',
  appName: 'AcompañaT',
  webDir: 'out',
  server: {
    url: "https://acompanat-telemedicina.vercel.app",
    cleartext: true
  }
};

export default config;