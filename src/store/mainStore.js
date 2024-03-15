import {createStore} from "vuex";
import createPersistedState from 'vuex-persistedstate';
import {v4} from "uuid";

export default createStore({
    state: {
        screen: {},
        mobileMenuActive: false,
        mobileMenuTransition: false,
        processList: [],
        currentEditableProcess: null,
        currentEditableProcessIdx: -1,
        currentEditableProcessID: null,
        answer: '',
        sessionList: [],

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
            if (!!arr) arr.forEach((v) => state.processList.unshift(v));
        },
        changeProcessInListByIdx(state, v) {
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
        changeSessionInListByIdx(state, v) {
            state.sessionList[v.idx] = v.session;
        },
        changeSessionInListByID(state, v) {
            state.sessionList.filter((vv) => vv.id === v.id)[0] = v.session;
        },
        changeSessionStatusByIdx(state, {idx, status}) {
            state.sessionList[idx].status = status;
        },
        removeSessionInListByID(state, v) {
            state.sessionList = state.sessionList.filter((vv) => vv.id !== v);
        },


        answer(state, v) {
            state.session = v;
        },


        addSessionInList(state, v) {
            if (!!v) state.sessionList.unshift(v);
        },
        changeSessionNameByID(state, v) {
            state.sessionList.filter((vv) => vv.id === v.id)[0].header.sessionTitle = v.name;
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
    actions: {
        setDefaultSession() {

        },
        createNewSession({commit, state}, p) {
            let preparePositions = (node) => {
                let result = {};
                const getNode = (node) => {
                    if (node.type === "loopList" && node.attrs.loopCount.value > 0) result[node.forKey] = 0;
                    if (node.list.length > 0) node.list.forEach((v) => {
                        getNode(v)
                    });
                };
                getNode(node);
                return result;
            };
            let prepareVars = (vars) => {
                let result = {};
                vars.forEach((v) => {
                    result[v.name] = v.value;
                });
                return result;
            };
            let generateID = () => {
                return v4();
            };
            let newSession = {
                id: generateID(),
                header: {
                    sessionTitle: 'Новая сессия. ' + p.header.processTitle,
                    createdDt: (new Date()).toISOString(),
                    changedDt: (new Date()).toISOString(),
                    description: 'Описание',

                },
                process: p,
                status: 'new',
                stack: [{
                    key: 'root',
                    type: p.rootNode.type,
                    counter: -1,
                    maxCount: 0,
                }],
                positions: preparePositions(p.rootNode),
                varsByName: prepareVars(p.vars),
                questInfo: {
                    rawQuest: '',
                    handledQuest: '',
                    aiHandledQuest: '',
                    outVarNames: [],
                    questDt: '',
                },

                history: []
            };
            commit('addSessionInList', newSession);
        },
    },
    getters: {
        sessionsByID(state) {
            return state.sessionList.reduce((s, v)=>{
                s[v.id] = v;
                return s;
            }, {});
        },
        processesByID(state) {
            return state.processList.reduce((s, v)=>{
                s[v.id] = v;
            }, {});
        },
    },

    plugins: [createPersistedState({
        key: 'psyProc', paths: [
            'currentEditableProcess',
            'currentEditableProcessIdx',
            'processList',
            'sessionList',
            'answer'

        ]
    }),],
})
