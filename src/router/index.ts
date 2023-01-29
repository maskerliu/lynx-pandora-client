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
      path: '/organization',
      name: 'Organization',
      redirect: '/organization/company',
      children: [
        {
          path: 'company',
          name: 'Company',
          component: require('../pages/organization/Company.vue').default,
          meta: { navBar: true }
        },
        {
          path: 'stuffMgr',
          name: 'StuffMgr',
          component: require('../pages/organization/StuffMgr.vue').default,
          meta: { navBar: true }
        },
      ]
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
          meta: { tabBar: true, needAuth: false }
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

      ]
    },
    {
      path: '/message',
      redirect: '/message/sessions',
      children: [
        {
          path: 'sessions',
          name: 'Sessions',
          component: require('../pages/message/Sessions.vue').default,
          meta: { navBar: true, tabBar: true },
        },
        {
          path: 'session/:sid',
          name: 'Session',
          component: require('../pages/message/Session.vue').default,
          meta: { navBar: true, tabBar: false },
        },
        {
          path: 'setting/:sid',
          name: 'SessionSetting',
          component: require('../pages/message/SessionSetting.vue').default,
          meta: { navBar: true, tabBar: false },
        },
        {
          path: 'contact',
          name: 'Contact',
          component: require('../pages/message/Contact.vue').default,
          meta: { navBar: true, tabBar: false },
        },
        {
          path: 'sysMessages',
          name: 'SysMessages',
          component: require('../pages/message/SysMessages.vue').default,
          meta: { navBar: true, tabBar: false },
        },
        {
          path: 'interactMessages',
          name: 'InteractMessages',
          component: require('../pages/message/InteractMessages.vue').default,
          meta: { navBar: true, tabBar: false },
        },
        {
          path: 'createRedPacket/:sid',
          name: 'CreateRedPacket',
          component: require('../pages/message/CreateRedPacket.vue').default,
          meta: { navBar: true, tabBar: false },
        },
      ]
    },
    {
      path: '/square',
      redirect: '/square/home',
      children: [
        {
          path: 'home',
          name: 'Square',
          component: require('../pages/square/Square.vue').default,
          meta: { navBar: false, tabBar: true }
        },
        {
          path: 'room',
          name: 'Chatroom',
          component: require('../pages/square/room/Chatroom.vue').default,
          meta: { navBar: false, tabBar: false }
        },
        {
          path: 'myRooms',
          name: 'MyRooms',
          component: require('../pages/square/room/MyRooms.vue').default,
          meta: { navBar: true, tabBar: false }
        },
        {
          path: 'propStore',
          name: 'PropStore',
          component: require('../pages/square/room/PropStore.vue').default,
          meta: { navBar: true, tabBar: false }
        },
        {
          path: 'post',
          name: 'Post',
          component: require('../pages/square/timeline/Post.vue').default,
          meta: { navBar: true, tabBar: false }
        },
        {
          path: 'myPosts',
          name: 'MyPosts',
          component: require('../pages/square/timeline/MyPosts.vue').default,
          meta: { navBar: true, tabBar: false }
        },
        {
          path: 'createMoment',
          name: 'CreateMoment',
          component: require('../pages/square/timeline/CreateMoment.vue').default,
          meta: { navBar: true, tabBar: false }
        },
        {
          path: 'moments/:uid',
          name: 'Moments',
          component: require('../pages/square/timeline/Moments.vue').default,
          meta: { navBar: true, tabBar: false }
        },
        {
          path: 'moment/:mid',
          name: 'Moment',
          component: require('../pages/square/timeline/Moment.vue').default,
          meta: { navBar: true, tabBar: false }
        }
      ]
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
        },
        {
          path: 'vip',
          name: 'VIP',
          component: require('../pages/user/VIP.vue').default,
          meta: { navBar: true }
        },
        {
          path: 'grade',
          name: 'Grade',
          component: require('../pages/user/Grade.vue').default,
          meta: { navBar: true }
        }
      ]
    },
    {
      path: '/payment',
      redirect: '/payment/myWallet',
      children: [
        {
          path: 'myWallet',
          name: 'MyWallet',
          component: require('../pages/payment/MyWallet.vue').default,
          meta: { navBar: true, tabBar: false }
        },
        {
          path: 'purseDetail',
          name: 'PurseDetail',
          component: require('../pages/payment/PurseDetail.vue').default,
          meta: { navBar: true, tabBar: false }
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
  ],
})
