// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/_projects/PsyProcessor-vue/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/_projects/PsyProcessor-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/_projects/PsyProcessor-vue/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Components from "file:///D:/_projects/PsyProcessor-vue/node_modules/unplugin-vue-components/dist/vite.mjs";
import { BootstrapVueNextResolver } from "file:///D:/_projects/PsyProcessor-vue/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/_projects/PsyProcessor-vue/vite.config.js";
var vite_config_default = defineConfig({
  // publicPath: import.meta.env.MODE === 'production'
  // publicPath: import.meta.ENV === 'production'
  //     ? '/PsyProcessor-vue/'
  //     : '/',
  // base:  import.meta.ENV === 'production'
  //     ? '/PsyProcessor-vue/'
  //     : '/',
  // base:  (()=>{
  //     // console.log('import.meta.mode =', import.meta.env.MODE);
  //     console.log('import.meta =', import.meta);
  //     return import.meta.env.MODE === 'development';
  // })()
  //     ? '/PsyProcessor-vue/'
  //     : '/FuckAll/',
  // base:  import.meta.env.BASE_URL,
  base: "/PsyProcessor-vue/",
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [BootstrapVueNextResolver()]
    })
  ],
  server: {
    // https: true,
    port: 9090
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxfcHJvamVjdHNcXFxcUHN5UHJvY2Vzc29yLXZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcX3Byb2plY3RzXFxcXFBzeVByb2Nlc3Nvci12dWVcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L19wcm9qZWN0cy9Qc3lQcm9jZXNzb3ItdnVlL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBVUkx9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHtCb290c3RyYXBWdWVOZXh0UmVzb2x2ZXJ9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICAvLyBwdWJsaWNQYXRoOiBpbXBvcnQubWV0YS5lbnYuTU9ERSA9PT0gJ3Byb2R1Y3Rpb24nXHJcbiAgICAvLyBwdWJsaWNQYXRoOiBpbXBvcnQubWV0YS5FTlYgPT09ICdwcm9kdWN0aW9uJ1xyXG4gICAgLy8gICAgID8gJy9Qc3lQcm9jZXNzb3ItdnVlLydcclxuICAgIC8vICAgICA6ICcvJyxcclxuXHJcbiAgICAvLyBiYXNlOiAgaW1wb3J0Lm1ldGEuRU5WID09PSAncHJvZHVjdGlvbidcclxuICAgIC8vICAgICA/ICcvUHN5UHJvY2Vzc29yLXZ1ZS8nXHJcbiAgICAvLyAgICAgOiAnLycsXHJcbiAgICAvLyBiYXNlOiAgKCgpPT57XHJcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2ltcG9ydC5tZXRhLm1vZGUgPScsIGltcG9ydC5tZXRhLmVudi5NT0RFKTtcclxuICAgIC8vICAgICBjb25zb2xlLmxvZygnaW1wb3J0Lm1ldGEgPScsIGltcG9ydC5tZXRhKTtcclxuICAgIC8vICAgICByZXR1cm4gaW1wb3J0Lm1ldGEuZW52Lk1PREUgPT09ICdkZXZlbG9wbWVudCc7XHJcbiAgICAvLyB9KSgpXHJcbiAgICAvLyAgICAgPyAnL1BzeVByb2Nlc3Nvci12dWUvJ1xyXG4gICAgLy8gICAgIDogJy9GdWNrQWxsLycsXHJcbiAgICAvLyBiYXNlOiAgaW1wb3J0Lm1ldGEuZW52LkJBU0VfVVJMLFxyXG4gICAgYmFzZTogICcvUHN5UHJvY2Vzc29yLXZ1ZS8nLFxyXG5cclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgICB2dWUoKSxcclxuICAgICAgICB2dWVKc3goKSxcclxuICAgICAgICBDb21wb25lbnRzKHtcclxuICAgICAgICAgICAgcmVzb2x2ZXJzOiBbQm9vdHN0cmFwVnVlTmV4dFJlc29sdmVyKCldXHJcbiAgICAgICAgfSldLFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgLy8gaHR0cHM6IHRydWUsXHJcbiAgICAgICAgcG9ydDogOTA5MFxyXG4gICAgfSxcclxuXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUSxlQUFlLFdBQVU7QUFDaFQsU0FBUSxvQkFBbUI7QUFDM0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixTQUFRLGdDQUErQjtBQUxnSSxJQUFNLDJDQUEyQztBQVF4TixJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQWlCeEIsTUFBTztBQUFBLEVBRVAsU0FBUztBQUFBLElBQ0wsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLE1BQ1AsV0FBVyxDQUFDLHlCQUF5QixDQUFDO0FBQUEsSUFDMUMsQ0FBQztBQUFBLEVBQUM7QUFBQSxFQUNOLFFBQVE7QUFBQTtBQUFBLElBRUosTUFBTTtBQUFBLEVBQ1Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDeEQ7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
