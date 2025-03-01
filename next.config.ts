import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "openweathermap.org",
                pathname:"/img/wn/**"
            },
        ],
    },
};

export default nextConfig;
