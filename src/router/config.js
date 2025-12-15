import Home from '../views/home/Home.vue';
import Center from '../views/center/Center.vue';
import UserList from '../views/user-manage/UserList.vue'
import UserAdd from '../views/user-manage/UserAdd.vue'
import ProductList from '../views/product-manage/ProductList.vue'
import ProductAdd from '../views/product-manage/ProductAdd.vue'
import NewsList from '../views/news-manage/NewsList.vue'
import NewsAdd from '../views/news-manage/NewsAdd.vue'

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
        path: '/user-manage/userlist',
        component: UserList,
    },
    {
        path: '/user-manage/useradd',
        component: UserAdd,
    },
    {
        path: '/product-manage/productlist',
        component: ProductList,
    },
    {
        path: '/product-manage/productadd',
        component: ProductAdd,
    },
    {
        path: '/news-manage/newslist',
        component: NewsList,
    },
    {
        path: '/news-manage/newsadd',
        component: NewsAdd,
    },
    {
        path: '/',
        redirect: '/home',
    }
]
export default routes;