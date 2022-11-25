export default {
  login: {
    phone: 'please enter your phone number',
    sendMsg: 'Verify Msg',
    done: 'Login'
  },
  common: {
    search: 'Search',
    done: 'Done',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    upload: 'Upload',
    bind: 'Bind',
    searchPlaceholder: 'please enter whatever your want'
  },
  iot: {
    device: {
      title: 'Device Info',
      name: 'DeviceId',
      address: 'Address',
      company: 'Company',
      delete: {
        title: 'Wanring❗️',
        confirm: 'Are you sure to remove the device【{deviceId}】？',
        confirm1: 'After the operation, the monitor data from this device can not be collected, be careful！！！'
      }
    },
  },
  company: {
    title: 'Manage Company',
    base: {
      title: 'Basic Info',
      name: 'Name',
      owner: 'Owner',
      tel: 'Telephone',
      address: 'Address',
      submit: 'Submit New Company Verify',
    },
    role: {
      title: 'Manage Roles',
      name: 'Title',
      desc: 'Description',
      curPrivileges: 'Current Privileges',
      allPrivileges: 'Available Privileges',
      add: 'Add New Role',
    },
    operator: {
      title: 'Operator Manager',
      add: 'Add New Operator',
      name: 'Name',
      curRoles: 'Current Roles',
      allRoles: 'Available Roles',
    }
  },
  mine: {
    company: 'Company',
    createCompany: '',
    bindDevice: 'Bind Device',
    settings: 'Settings',
    profile: {
      avatar: 'Avatar',
      name: 'Name',
      phone: 'Phone',
    }
  },
  settings: {
    title: 'Settings',
    sys: {
      title: 'Sys Info',
      mqttBroker: 'MQTT Broker',
      about: 'About',
      help: 'Help & Feedback'
    },
    notify: {
      title: 'Notification',
      sound: 'Sound',
      vibrate: 'Vibrate'
    },
    fontlang: {
      title: 'Font & Language',
      fontSize: 'Font Size',
      multiLang: 'Multi Lang'
    },
    logout: 'Logout'
  },
  message: {
    title: 'Message Center'
  }
}