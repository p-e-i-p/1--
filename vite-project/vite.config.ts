// vite.config.ts
import { defineConfig, ConfigEnv, UserConfigExport, loadEnv } from 'vite';
import { viteMockServe } from 'vite-plugin-mock';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// 获取当前文件的绝对路径（替代 __dirname）

export default ({ command ,mode}: ConfigEnv): UserConfigExport => {
  let env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      viteMockServe({
        localEnabled: command === 'serve',
      }),
    ],
    resolve: {
      alias: {

        '@': path.resolve('./src'),
      },
    },
    // 配置代理服务器解决跨域
    server: {
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 目标地址
          target: env.VITE_APP_SERVICE_URL,
          // 开启代理服务
          changeOrigin: true,
          // 重新请求地址将/dev-api从url地址中删除
          rewrite: (path) => path.replace(/^\/dev-api/, ''),
        },
      },
    },
  };
};