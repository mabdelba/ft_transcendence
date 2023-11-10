/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        domains: ['localhost:4000'] // whatever port your backend runs on
    }
}

module.exports = nextConfig
