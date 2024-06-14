import {createStore} from "vuex";
import createPersistedState from 'vuex-persistedstate';
import {v4} from "uuid";


const defaultSortOrder = {
    field: 'changedDt',
    order: 'ASC'
};

const generateID = () => {
    return v4();
};

export default createStore({
    state: {
        mobileMenuActive: false,
        mobileMenuTransition: false,
        processList: [],
        processListSortMode: {...defaultSortOrder},
        currentEditableProcess: null,
        currentEditableProcessID: null,
        isNewProcess: false,
        answer: '',
        sessionList: [],
        currentSessionID: null,
        token: null,
        user: null,
        //curLang: 'en',
        //verbs: verbs['en'],
        isMobile: false,
        blur: false,
        testData: '',
    },
    mutations: {
        processList(state, v) {
            state.processList = v;
        },
        processListSortMode(state, v) {
            state.processListSortMode = v;
        },
        isNewProcess(state, v) {
            state.isNewProcess = v;
        },
        addProcessesInList(state, arr) {
            if (!!arr) arr.forEach((v) => state.processList.unshift(v));
        },
        changeProcessStatusByID(state, v) {
            this.getters.processesByID[v.id].status = v.status;
        },
        changeProcessInListByID(state, v) {
            //найти индекс по ID и заменить по индексу
            for (let i=0; i<state.processList.length; i++)
                if (state.processList[i].id === v.id) {
                    state.processList[i] = v.process;
                    return
                }
        },
        trashProcessInListByID(state, v) {
            this.getters.processesByID[v.id].deleted = v.deleted;
        },
        removeProcessInListByID(state, v) {
            //найти индекс по ID и удалить по индексу
            for (let i=0; i<state.processList.length; i++)
                if (state.processList[i].id === v) {
                    state.processList.splice(i, 1);
                    return
                }
        },

        currentEditableProcess(state, v) {
            state.currentEditableProcess = v;
        },
        currentEditableProcessID(state, v) {
            state.currentEditableProcessID = v;
        },
        currentSessionID(state, v) {
            state.currentSessionID = v;
        },
        sessionList(state, v) {
            state.sessionList = v;
        },

        changeSessionInListByID(state, v) {
            state.sessionList.filter((vv) => vv.id === v.id)[0] = v.session;
        },

        changeSessionStatusByID(state, {id, status}) {
            state.sessionList.filter((vv) => vv.id === id)[0].status = status;
        },
        sessionsToPausedExceptThis(state, id) {
            state.sessionList.forEach((v) => {
                if (v.id !== id && v.status === 'inProgress') v.status = 'paused'
            })
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
            return new Promise((resolve)=>resolve(newSession.id));
        },

        createNewProcess({commit, state}, newStatus) {
            let newProcess = {
                    id: generateID(),
                    header: {
                        processTitle: "Новый процесс",
                        version: "0.0.1",
                        processCategory: ["common"],
                        createdDt: (new Date()).toISOString(),
                        changedDt: (new Date()).toISOString(),
                        description: 'Описание',
                        toSave: false,
                        toAdd: false,
                    },
                    type: 'process',
                    status: newStatus,
                    deleted: false,
                    vars: [
                        {name: '$topic', value: '',},
                        {name: '$last', value: '',},
                    ],
                    rootNode: {
                        type: 'loopList',
                        attrs: {
                            nodeName: {
                                inpType: 'text',
                                inpLabel: 'Название узла (optional)',
                                value: 'root',
                            },
                            loopCount: {
                                inpType: 'number',
                                inpLabel: 'Количество циклов',
                                value: 0, // ноль означает бесконечный цикл
                            },
                        },
                        list: [],
                        forKey: 'root',
                    }
             };
            commit('addProcessesInList', [newProcess]);
            return new Promise((resolve)=>resolve(newProcess.id));
        },
    },
    getters: {
        //формирует объект, у которого в качестве ключей используются идентификаторы сессий, а в качестве значений - объекты сессий
        sessionsByID(state) {
            return state.sessionList.reduce((s, v) => {
                s[v.id] = v;
                return s;
            }, {});
        },
        finishedProcessesByID(state) {
            return state.processList.reduce((s, v) => {
                if (v.status='finished') {
                    s[v.id] = v;
                    return s;
                }
            }, {});
        },
        //формирует объект, у которого в качестве ключей используются идентификаторы процессов, а в качестве значений - объекты процессов
        processesByID(state) {
            return state.processList.reduce((s, v) => {
                s[v.id] = v;
                return s;
            }, {});
        },

        readyProcessesByID(state) {
            return state.processList.reduce((s, v) => {
                if (v.status='ready') {
                    s[v.id] = v;
                    return s;
                }
            }, {});
        },
        draftProcessesByID(state) {
            return state.processList.reduce((s, v) => {
                if (v.status='draft') {
                    s[v.id] = v;
                    return s;
                }
            }, {});
        },

        templateProcessesByID(state) {
            return state.processList.reduce((s, v) => {
                if (v.status='template') {
                    s[v.id] = v;
                    return s;
                }
            }, {});
        },

        markerSessions(state){
            return state.sessionList.map((v)=>{return {id: v.id, title: v.header.sessionTitle, time: v.header.changedDt}}).sort((a, b) => b.time - a.time);
        },
    },

    plugins: [createPersistedState({
        key: 'psyProc', paths: [
            'processListSortMode',
            'currentEditableProcess',
            'currentEditableProcessID',
            'currentSessionID',
            'processList',
            'sessionList',
            'answer'

        ]
    }),],
})
