import {createStore} from "vuex";
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    state: {
        screen: {},
        mobileMenuActive: false,
        mobileMenuTransition: false,
        currentEditableProcess: null,
        token: null,
        user: null,
        //curLang: 'en',
        //verbs: verbs['en'],
        isMobile: false,
        blur: false,
        testData: '',
    },
    mutations: {
        testData(state, v) {
            state.testData = v;
        },
        currentEditableProcess(state, v) {
            state.currentEditableProcess = v;
        },
        mobileMenuActive(state, v) {
            state.mobileMenuTransition = true;
            state.mobileMenuActive = v;
        },
        mobileMenuTransitionEnd(state, v){
            state.mobileMenuTransition = false;
        },
        screen(state, v) {
            state.screen = v;
        },
        isMobile(state, v) {
            state.isMobile = v;
        },

        user(state, v) {
            state.user = v;
        },
        token(state, v) {
            state.token = v;
        },
        curLang(state, v) {
            state.curLang = v;
            state.verbs = verbs[v];
        },
        blur(state, v) {
            state.blur = v;
        },
    },
    actions: {},
    getters: {
        //balance(state) {
        //    return state.walletList.reduce((s, v) => s += v.confirmed_balance * v.currency_price_usd, 0)
        //},
    },
    plugins: [createPersistedState({
        key: 'ppVuexData',
        // paths: ['currentEditableProcess']
    })],

})
