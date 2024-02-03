import {createStore} from "vuex";
import createPersistedState from 'vuex-persistedstate';

export default createStore({
    state: {
        screen: {},
        mobileMenuActive: false,
        mobileMenuTransition: false,
        processList: [],
        currentEditableProcess: null,
        currentEditableProcessIdx: -1,
        sessionList: null,
        currentSession: null,
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
        processList(state, v) {
            state.processList = v;
        },
        addProcessesInList(state, arr) {
            console.log(arr);
            if (!!arr) arr.forEach((v)=>state.processList.unshift(v));
        },
        changeProcessInList(state, v) {
            state.processList[v.idx] = v.process;
        },
        currentEditableProcess(state, v) {
            state.currentEditableProcess = v;
        },
        currentEditableProcessIdx(state, v) {
            state.currentEditableProcessIdx = v;
        },

        sessionList(state, v) {
            state.sessionList = v;
        },
        currentSession(state, v) {
            state.currentSession = v;
        },


        mobileMenuActive(state, v) {
            state.mobileMenuTransition = true;
            state.mobileMenuActive = v;
        },
        mobileMenuTransitionEnd(state, v) {
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
        key: 'ppVuexDataEditableProcess',
        paths: ['currentEditableProcess']
    }), createPersistedState({
        key: 'ppVuexDataList',
        paths: ['processList']
    })],

})
