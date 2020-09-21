import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import User from './views/nav1/User.vue'
import Admin from './views/nav1/Admin.vue'
import echarts from './views/charts/echarts.vue'
import Mission from './views/nav2/Mission.vue'
import Gift from './views/nav2/Gift.vue'
import News from './views/nav3/News.vue'
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
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/main', component: Main, name: '主页', hidden: true },
            { path: '/admin', component: Admin, name: '管理员列表' },
            { path: '/user', component: User, name: '用户列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '任务管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            { path: '/Mission', component: Mission, name: '跑跑任务' },
            { path: '/Gift', component: Gift, name: '积分礼物' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '社区资讯',
        iconCls: 'fa fa-address-card',
        children: [
            { path: '/News', component: News, name: '资讯信息' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;