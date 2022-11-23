export default {
  login: {
    phone: '请输入您的手机号',
    sendMsg: '发送验证码',
    done: '登录'
  },
  common: {
    done: '确定',
    cancel: '取消',
    delete: '删除',
    save: '保存',
    upload: '上传',
    searchPlaceholder: '请输入搜索关键词'
  },
  iot: {
    device: {
      name: '设备名',
      address: '地址',
      company: '所属公司',
      delete: {
        title: '警告❗️',
        confirm: '确定要从系统中移除【{deviceId}】这台设备吗？',
        confirm1: '设备移除后，设备上的数据将在系统中无法收集，请谨慎操作！！！'
      }
    }
  },
  company: {
    base: {
      title: '基本信息',
      name: '公司名',
      owner: '负责人',
      tel: '联系电话',
      address:'地址',
    },
    hr: {
      title: '人员管理',
    }
  },
  mine: {
    company: '公司',
    bindDevice: '绑定设备',
    settings: '设置'
  },
  settings: {
    sys: {
      title: '系统信息',
      mqttBroker: 'MQTT服务',
      about: '关于',
      help: '帮助与反馈'
    },
    notify: {
      title: '消息通知',
      sound: '消息声音',
      vibrate: '震动'
    },
    fontlang: {
      title: '字体与多语言',
      fontSize: '字体大小',
      multiLang: '多语言'
    },
    logout: '退出登录'
  }
}