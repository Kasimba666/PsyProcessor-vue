import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
    // publicPath: import.meta.env.MODE === 'production'
    // publicPath: import.meta.ENV === 'production'
    //     ? '/PsyProcessor-vue/'
    //     : '/',
    base:  import.meta.ENV === 'production'
        ? '/PsyProcessor-vue/'
        : '/',
    plugins: [
        vue(),
        vueJsx(),
        Components({
            resolvers: [BootstrapVueNextResolver()]
        })],
    server: {
        // https: true,
        port: 9090
    },

    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
