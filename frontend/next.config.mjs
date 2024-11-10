/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config, { dev }) {

      if (!dev) {
        config.devtool = false;
    }

      config.module.rules.push({
        test: /\.svg$/,
        use: ["@svgr/webpack"]
      });
  
      return config;
    }
  };

export default nextConfig;
