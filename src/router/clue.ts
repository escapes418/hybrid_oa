import ClueList from '@/views/clue/list.vue' //线索列表
import ClueForm from '@/views/clue/form.vue' //线索表单

export default [
    {
        path: '/clue/list',
        name: 'ClueList',
        component: ClueList,
        meta: {
            docTitle: "线索列表"
        }
    }, {
        path: '/clue/form',
        name: 'ClueForm',
        component: ClueForm,
        meta: {
            docTitle: "编辑线索"
        }
    },
];