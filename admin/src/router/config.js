import Home from '../views/home/Home.vue';
import Center from '../views/center/Center.vue';
import UserList from '../views/user-management/UserList.vue'
import UserAdd from '../views/user-management/UserAdd.vue'
import ProductList from '../views/product-management/ProductList.vue'
import ProductAdd from '../views/product-management/ProductAdd.vue'
import NewsList from '../views/news-management/NewsList.vue'
import NewsAdd from '../views/news-management/NewsAdd.vue'

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
        path: '/product-management/ProductList',
        component: ProductList,
    },
    {
        path: '/product-management/ProductAdd',
        component: ProductAdd,
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
        path: '/',
        redirect: '/home',
    }
]
export default routes;