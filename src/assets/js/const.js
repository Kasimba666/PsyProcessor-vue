/**
 * Created by _BOB_ on 28.04.2020.
 */

const nodeTypesArr = [
    {value: 'quest', title: 'Вопрос'},
    {value: 'loopList', title: 'Линейный список',},
    {value: 'randList', title: 'Вероятностный список'},
];

const nodeTypesObj = nodeTypesArr.reduce((s, v)=> {
    s[v.value] = v;
    return s;
}, {});

export const nodeTypes = {
    arr: nodeTypesArr,
    obj: nodeTypesObj
};
