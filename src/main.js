import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import '@/assets/css/app.scss';
// import '@/style.css'

import { createApp } from 'vue';
import App from "@/App.vue"
import router from "@/router/router.js";
import store from '@/store/mainStore.js';

// const DEBUG = import.meta.env.MODE === "development";
// console.log('import.meta.env.MODE =', import.meta.env.MODE);
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
    },
    unmounted(el) {
        el.removeEventListener("keypress", el.inputHandler);
    },
    update() {
        // console.log('number-only update');
    },
}).directive(    'click-outside', {
        beforeMount(el, binding) {
            el.clickOutsideEvent = function(event) {
                // Check if the clicked element is neither the element
                // to which the directive is applied nor its child
                if (!(el === event.target || el.contains(event.target))) {
                    // Invoke the provided method
                    binding.value(event);
                }
            };
            document.addEventListener('click', el.clickOutsideEvent);
        },
        unmounted(el) {
            // Remove the event listener when the bound element is unmounted
            document.removeEventListener('click', el.clickOutsideEvent);
        },
}
);

app.use(ElementPlus);

app.use(router).use(store).mount('#app');
