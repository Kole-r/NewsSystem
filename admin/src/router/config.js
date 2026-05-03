import Home from '../views/home/Home.vue';
import Center from '../views/center/Center.vue';
import UserList from '../views/user-management/UserList.vue'
import UserAdd from '../views/user-management/UserAdd.vue'
import NewsList from '../views/news-management/NewsList.vue'
import NewsAdd from '../views/news-management/NewsAdd.vue'
import JobList from '../views/job-management/JobList.vue'
import JobAdd from '../views/job-management/JobAdd.vue'

const routes = [
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/center',
        component: Center,
    },
    {
        path: '/user-management/UserList',
        component: UserList,
        requiresAdmin: true,
    },
    {
        path: '/user-management/UserAdd',
        component: UserAdd,
        requiresAdmin: true,
    },
    {
        path: '/news-management/NewsList',
        component: NewsList,
    },
    {
        path: '/news-management/NewsAdd',
        component: NewsAdd,
    },
    {
        path: '/job-management/JobList',
        component: JobList,
    },
    {
        path: '/job-management/JobAdd',
        component: JobAdd,
    },
    {
        path: '/',
        redirect: '/home',
    }
]
export default routes;