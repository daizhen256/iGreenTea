import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import echarts from './views/charts/echarts.vue'
import User from './views/system/User.vue'
import Dict from './views/system/Dict.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/user', component: User, name: '用户管理' },
            { path: '/dict', component: Dict, name: '数据词典' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: 'Charts',
        iconCls: 'fa fa-bar-chart',
        children: [
            { path: '/echarts', component: echarts, name: 'echarts' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;