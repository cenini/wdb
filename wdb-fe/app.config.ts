import { ConfigContext, ExpoConfig } from "expo/config";

const env = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => key.startsWith("EXPO_PUBLIC_"))
);

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "wdb-fe",
  name: "wdb frontend",
  extra: { env },
});
