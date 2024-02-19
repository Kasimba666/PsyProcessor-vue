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
        sessionList: [],
        session: null,
        token: null,
        user: null, //curLang: 'en',
        //verbs: verbs['en'],
        isMobile: false,
        blur: false,
        testData: '',
    },
    mutations: {

        processList(state, v) {
            state.processList = v;
        },
        addProcessesInList(state, arr) {
            console.log(arr);
            if (!!arr) arr.forEach((v) => state.processList.unshift(v));
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
        sessionStatus(state, {idx, status}) {
            state.sessionList[idx].status = status;
        },

        session(state, v) {
            state.session = v;
        },
        addSessionInList(state, v) {
            if (!!v) state.sessionList.unshift(v);
        },
        isNewSession(state, v) {
            state.isNewSession = v;
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
    }, actions: {
        createNewSession({commit, state}, p) {
            let newSession = {
                header: {
                    sessionTitle: 'Новая сессия. ' + p.header.processTitle,
                    createdDt: (new Date()).toISOString(),
                    changedDt: (new Date()).toISOString(),
                    description: 'Описание',

                }, process: p,
                status: 'new',
                stack: [{
                    key: 'root', idxChild: -1
                }],
                history: []
            };
            commit('addSessionInList', newSession);
        },
    }, getters: {
        //balance(state) {
        //    return state.walletList.reduce((s, v) => s += v.confirmed_balance * v.currency_price_usd, 0)
        //},
    }, plugins: [createPersistedState({
        key: 'ppVuexDataEditableProcess', paths: ['currentEditableProcess']
    }), createPersistedState({
        key: 'ppVuexDataProcessList', paths: ['processList']
    }), createPersistedState({
        key: 'ppVuexDataSessionList', paths: ['sessionList']
    }), createPersistedState({
        key: 'ppVuexDataSession', paths: ['currentSession']
    }),],

})
