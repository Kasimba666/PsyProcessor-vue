// vite.config.dev.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///D:/_projects/PsyProcessor-vue/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/_projects/PsyProcessor-vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/_projects/PsyProcessor-vue/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import Components from "file:///D:/_projects/PsyProcessor-vue/node_modules/unplugin-vue-components/dist/vite.mjs";
import { BootstrapVueNextResolver } from "file:///D:/_projects/PsyProcessor-vue/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/_projects/PsyProcessor-vue/vite.config.dev.js";
var vite_config_dev_default = defineConfig({
  //base: '/PsyProcessor-vue/',
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
  vite_config_dev_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuZGV2LmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcX3Byb2plY3RzXFxcXFBzeVByb2Nlc3Nvci12dWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXF9wcm9qZWN0c1xcXFxQc3lQcm9jZXNzb3ItdnVlXFxcXHZpdGUuY29uZmlnLmRldi5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovX3Byb2plY3RzL1BzeVByb2Nlc3Nvci12dWUvdml0ZS5jb25maWcuZGV2LmpzXCI7aW1wb3J0IHtmaWxlVVJMVG9QYXRoLCBVUkx9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSdcclxuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXHJcbmltcG9ydCB2dWVKc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlLWpzeCdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHtCb290c3RyYXBWdWVOZXh0UmVzb2x2ZXJ9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVycydcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgICAvL2Jhc2U6ICcvUHN5UHJvY2Vzc29yLXZ1ZS8nLFxyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICAgIHZ1ZSgpLFxyXG4gICAgICAgIHZ1ZUpzeCgpLFxyXG4gICAgICAgIENvbXBvbmVudHMoe1xyXG4gICAgICAgICAgICByZXNvbHZlcnM6IFtCb290c3RyYXBWdWVOZXh0UmVzb2x2ZXIoKV1cclxuICAgICAgICB9KV0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgICAvLyBodHRwczogdHJ1ZSxcclxuICAgICAgICBwb3J0OiA5MDkwXHJcbiAgICB9LFxyXG5cclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgICBhbGlhczoge1xyXG4gICAgICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UixTQUFRLGVBQWUsV0FBVTtBQUN4VCxTQUFRLG9CQUFtQjtBQUMzQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVEsZ0NBQStCO0FBTG9JLElBQU0sMkNBQTJDO0FBUTVOLElBQU8sMEJBQVEsYUFBYTtBQUFBO0FBQUEsRUFFeEIsU0FBUztBQUFBLElBQ0wsSUFBSTtBQUFBLElBQ0osT0FBTztBQUFBLElBQ1AsV0FBVztBQUFBLE1BQ1AsV0FBVyxDQUFDLHlCQUF5QixDQUFDO0FBQUEsSUFDMUMsQ0FBQztBQUFBLEVBQUM7QUFBQSxFQUNOLFFBQVE7QUFBQTtBQUFBLElBRUosTUFBTTtBQUFBLEVBQ1Y7QUFBQSxFQUVBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDeEQ7QUFBQSxFQUNKO0FBQ0osQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
