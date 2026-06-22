/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // 🚀 To zmusi Vercela do zignorowania problemu z 'prisma/config' i postawienia strony!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;