import {createRouter, createWebHashHistory} from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [{
        path: '/',
        redirect: '/login',
    }, {
        path: '/login',
        component: () => import('../views/user/Login.vue'),
        meta: {title: '用户登录'}
    }, {
        path: '/register',
        component: () => import('../views/user/Register.vue'),
        meta: {title: '用户注册'}
    }, {
        path: '/home',
        redirect: '/homePage',
        component: () => import('../views/Home.vue'),
        children: [
            {
                path: '/homePage',
                name: 'homePage',
                component: () => import('../views/HomePage.vue'),
                meta: {title: '首页'}
            },
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('../views/user/Dashboard.vue'),
                meta: {title: '个人信息'}
            },
            //以下为Lab2新增，添加了商店模块的界面，请大家自己添加商品模块的界面
            {
                path: '/allStore',
                name: 'allStore',
                component: () => import('../views/store/AllStores.vue'),
                meta: {title: '商品列表'}
            },
            //你也可以把创建商店界面改成一个弹窗
            {
                path: '/createStore',
                name: 'createStore',
                component: () => import('../views/store/CreateStore.vue'),
                meta: {
                    title: '创建商店',
                    permission: ['MANAGER']
                }
            },
            {
                path: '/storeDetail/:storeId',
                name: 'storeDetail',
                component: () => import('../views/store/StoreDetail.vue'),
                meta: {title: '店铺详情'}
            },
            {
                path: '/createProduct',
                name: 'createProduct',
                component: () => import('../views/product/CreateProduct.vue'),
                meta: {
                    title: '创建商品',
                    permission: ['STAFF']
                }
            },
            {
                path: '/productDetail/:productId',
                name: 'productDetail',
                component: () => import('../views/product/ProductDetail.vue'),
                meta: {title: '商品详情'}
            },
            {
                path: '/orders',
                name: 'orders',
                component: () => import('../views/order/Orders.vue'),
                meta: {
                    title: '订单管理',
                }
            },
            {
                path: '/publishCoupon',
                name: 'publishCoupon',
                component: () => import('../views/coupon/PublishCoupon.vue'),
                meta: {
                    title: '创建优惠券',
                    permission: ['STAFF', 'CEO']
                }
            },
            {
                path: '/coupons',
                name: 'coupons',
                component: () => import('../views/coupon/Coupons.vue'),
                meta: {
                    title: '查看优惠券',
                    permission: ['CUSTOMER', 'STAFF', 'CEO']
                }
            },
            {
                path: '/myCoupons',
                name: 'myCoupons',
                component: () => import('../views/coupon/MyCoupons.vue'),
                meta: {
                    title: '我的券包',
                    permission: ['CUSTOMER']
                }
            },
            {
                path: '/search',
                name: 'search',
                component: () => import('../views/search/Search.vue'),
                meta: {
                    title: '搜索'
                }
            },
            {
                path: '/statistic',
                name: 'statistic',
                component: () => import('../views/order/Statistic.vue'),
                meta: {
                    title: '报表',
                    permission: ['STAFF', 'CEO']
                }
            },
            {
                path: '/shoppingCart',
                name: 'shoppingCart',
                component: () => import('../views/user/ShoppingCart.vue'),
                meta: {
                    title: '购物车',
                    permission: ['CUSTOMER']
                }
            },
            {
                path: '/canary',
                name: 'canary',
                component: () => import('../views/Canary.vue'),
                meta: {
                    title: 'Canary',
                    permission: ['CUSTOMER']
                }
            },
        ]
    }, {
        path: '/payCallback',
        name: 'payCallback',
        component: () => import('../views/PayCallback.vue'),
        meta: {title: '支付成功'}
    }, {
        path: '/404',
        name: '404',
        component: () => import('../views/NotFound.vue'),
        meta: {title: '404'}
    }, {
        path: '/:catchAll(.*)',
        redirect: '/404'
    }]
});

router.beforeEach((to, _, next) => {
    const token: string | null = sessionStorage.getItem('token');
    const role: string | null = sessionStorage.getItem('role');

    if (to.meta.title) {
        document.title = to.meta.title;
    }

    if (token) {
        if (to.meta.permission) {
            if (to.meta.permission.includes(role!)) {
                next();
            } else {
                next('/404');
            }
        } else {
            next();
        }
    } else {
        if (to.path === '/login') {
            next();
        } else if (to.path === '/register') {
            next();
        } else {
            next('/login');
        }
    }
});

export {router};
