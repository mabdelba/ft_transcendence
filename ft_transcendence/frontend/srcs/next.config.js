/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['backend'] // whatever port your backend runs on
    }
}

module.exports = nextConfig
