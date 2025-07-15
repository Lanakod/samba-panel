import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    webpack: (config, {isServer}) => {
        if (isServer) {
            config.externals = config.externals || [];
            // Mark cpu-features as external so webpack doesn't try to bundle it
            config.externals.push('cpu-features');
        }
        return config;
    },
    output: "standalone"
};

export default nextConfig;
