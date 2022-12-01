import { createRouter, createWebHashHistory } from 'vue-router'

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'Login',
      component: require('../pages/user/Login.vue').default
    },
    {
      path: '/iot',
      name: 'IOT',
      redirect: '/iot/devices',
      children: [
        {
          path: 'devices',
          name: 'DeviceMgr',
          component: require('../pages/iot/DeviceMgr.vue').default,
          meta: { tabBar: true }
        },
        {
          path: 'device/:did',
          name: 'DeviceDetail',
          component: require('../pages/iot/DeviceDetail.vue').default,
          meta: { navBar: true }
        },
        {
          path: 'bind',
          name: 'BindDevice',
          component: require('../pages/iot/BindDevice.vue').default,
          meta: { navBar: true }
        },
        {
          path: 'company',
          name: 'Company',
          component: require('../pages/iot/Company.vue').default,
          meta: { navBar: true }
        },
      ]
    },
    {
      path: '/message',
      name: 'Message',
      component: require('../pages/message/Message.vue').default,
      meta: { navBar: true, tabBar: true }
    },
    {
      path: '/mine',
      name: 'Mine',
      redirect: '/mine/my',
      children: [
        {
          path: 'my',
          name: 'Mine',
          component: require('../pages/user/Mine.vue').default,
          meta: { tabBar: true, needAuth: true }
        },
        {
          path: 'profile/:uid',
          name: 'UserProfile',
          component: require('../pages/user/UserProfile.vue').default,
          meta: { navBar: true }
        }
      ]
    },
    {
      path: '/settings',
      name: 'Settings',
      redirect: '/settings/main',
      children: [
        {
          path: 'main',
          name: 'Settings',
          component: require('../pages/settings/Settings.vue').default,
          meta: { navBar: true },
        },
        {
          path: 'about',
          name: 'About',
          component: require('../pages/settings/About.vue').default,
          meta: { navBar: true },
        },
        {
          path: 'privacyAgreement/:url',
          name: 'PrivacyAgreement',
          component: require('../pages/settings/PrivacyAgreement.vue').default,
          meta: { navBar: true },
        },
        {
          path: 'help',
          name: 'Help',
          component: require('../pages/settings/Help.vue').default,
          meta: { navBar: true },
        },
        {
          path: 'multiLang',
          name: 'MultiLang',
          component: require('../pages/settings/MultiLang.vue').default,
          meta: { navBar: true },
        },
        {
          path: 'fontSize',
          name: 'FontSize',
          component: require('../pages/settings/FontSize.vue').default,
          meta: { navBar: true },
        }
      ]
    },
    {
      path: '/dbmgr',
      name: 'DBMgr',
      component: require('../pages/settings/DBMgr.vue').default,
      meta: { navBar: true }
    },
    {
      path: '/dbdoc/:db',
      name: 'DBDoc',
      component: require('../pages/settings/DBDocMgr.vue').default,
      meta: { navBar: true }
    }
  ],
})
