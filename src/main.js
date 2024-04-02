import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
// import '@/style.css'
import '@/assets/css/app.scss';

import { createApp } from 'vue';
import App from "@/App.vue"
import router from "@/router/router.js";
import store from '@/store/mainStore.js';

const DEBUG = import.meta.env.MODE === "development";
const app = createApp(App);

app.directive('numberOnly', {
    mounted(el, config) {
        console.log("numberOnly =",config);
        el.inputHandler = function (e) {
            function search(str, char) {
                for (let i = str.length; i--;) {
                    if (char === str[i]) return i;
                }
                return -1;
            }

            if (e.key === '.' && el.value.length === 0) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            console.log(e);
            if (search('1234567890.', e.key) < 0) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            console.log('el._value =', el._value);
            console.log('el =', this.value);
            // if (e.key === '.' && ((+('' + el._value + '9')) % 1) > 0) {
            if (e.key === '.' && (search('' + el.value, '.') > -1)) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        };
        el.addEventListener("keypress", el.inputHandler);
    },
    unmounted(el) {
        el.removeEventListener("keypress", el.inputHandler);
    },
    update() {
        // console.log('number-only update');
    },
});
// app.directive('numberOnly', {
//     bind(el, config) {
//         console.log("numberOnly =",config);
//         el.inputHandler = function (e) {
//             function search(str, char) {
//                 for (let i = str.length; i--;) {
//                     if (char === str[i]) return i;
//                 }
//                 return -1;
//             }
//
//             if (e.key === '.' && el.value.length === 0) {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 return;
//             }
//             console.log(e);
//             if (search('1234567890.', e.key) < 0) {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 return;
//             }
//             console.log('el._value =', el._value);
//             console.log('el =', this.value);
//             // if (e.key === '.' && ((+('' + el._value + '9')) % 1) > 0) {
//             if (e.key === '.' && (search('' + el.value, '.') > -1)) {
//                 e.preventDefault();
//                 e.stopPropagation();
//                 return;
//             }
//         };
//         el.addEventListener("keypress", el.inputHandler);
//     },
//     unbind(el) {
//         el.removeEventListener("keypress", el.inputHandler);
//     },
//     update() {
//         // console.log('number-only update');
//     },
// });

app.use(router).use(store).mount('#app')
