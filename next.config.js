/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: [], // Remove any remote domains
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.module.rules.push({
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]',
                },
            });
        }

        return config;
    },
};

module.exports = nextConfig