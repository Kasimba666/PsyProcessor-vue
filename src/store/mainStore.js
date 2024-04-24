import {createStore} from "vuex";
import createPersistedState from 'vuex-persistedstate';
import {v4} from "uuid";

const screenBreakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
};

const defaultSortOrder = {
    field: 'changedDt',
    order: 'ASC'
};

export default createStore({
    state: {
        screenBreakpoints,
        screen: {
            width: 1200,
            height: 900,
            type: 'lg',
        },
        mobileMenuActive: false,
        mobileMenuTransition: false,
        processList: [],
        processListSortMode: {...defaultSortOrder},
        currentEditableProcess: null,
        currentEditableProcessIdx: -1,
        currentEditableProcessID: null,
        answer: '',
        sessionList: [],
        currentSessionID: null,
        token: null,
        user: null, //curLang: 'en',
        //verbs: verbs['en'],
        isMobile: false,
        blur: false,
        testData: '',
    },
    mutations: {
        screen(state, v) {
            state.screen = v;
        },

        processList(state, v) {
            state.processList = v;
        },
        processListSortMode(state, v) {
            state.processListSortMode = v;
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

        currentSessionID(state, v) {
            state.currentSessionID = v;
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

        changeSessionStatusByID(state, {id, status}) {
            state.sessionList.filter((vv) => vv.id === id)[0].status = status;
        },
        removeSessionInListByID(state, v) {
            state.sessionList = state.sessionList.filter((vv) => vv.id !== v);
        },


        answer(state, v) {
            state.answer = v;
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
            return state.sessionList.reduce((s, v) => {
                s[v.id] = v;
                return s;
            }, {});
        },
        processesByID(state) {
            return state.processList.reduce((s, v) => {
                s[v.id] = v;
            }, {});
        },
        markerSessions(state){
            return state.sessionList.map((v)=>{return {id: v.id, title: v.header.sessionTitle, time: v.header.changedDt}}).sort((a, b) => b.time - a.time);
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
