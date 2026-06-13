import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = withSerwist({
  turbopack: {},
  poweredByHeader: false,
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: "/robots/optimus-gen2-dummy",
        destination: "/robots/optimus-gen2/",
        permanent: true,
      },
      {
        source: "/robots/optimus-gen2-dummy/",
        destination: "/robots/optimus-gen2/",
        permanent: true,
      },
    ];
  },
});

export default nextConfig;
