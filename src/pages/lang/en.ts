export default {
  login: {
    phone: 'please enter your phone number',
    sendVerifyCode: 'Verify Code',
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
    submit: 'Submit',
    bind: 'Bind',
    pin: 'Pin',
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
      title: 'Stuff Manager',
      add: 'Add New Stuff',
      name: 'Name',
      curRoles: 'Current Roles',
      allRoles: 'Available Roles',
    }
  },
  mine: {
    needUpdateProfile: 'Please Update Your Profile First',
    company: 'Company',
    createCompany: 'Create Your Company',
    bindDevice: 'Bind Device',
    settings: 'Settings',
    profile: {
      title: 'Profile',
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
      help: 'Help & Feedback',
      cleanCache: 'Clean Cache',
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
    about: {
      privacy: 'Privacy Policy',
      sdks: 'Third Part SDK List',
      privacySummary: 'Privacy Summary',
      customerService: 'Customer Service'
    },
    help: {
      feedback: 'Feedback',
      feedbackTitle: 'Question Or Suggestion',
      feedbackPlaceholder: 'please give us your valuable question or suggestion',
      feedbackSnaps: 'Snaps(optional)',
      onlineHelp: 'Online Help'
    },
    logout: 'Logout'
  },
  message: {
    title: 'Message Center',
    session: {

    },
    sys: {
      title: 'System Message',
    },
    contact: {
      title: 'Contact',
      create: 'Create Group',
      add: 'Add Member',
    },
    setting: {
      title: 'Chat Setting',
      groupName: 'Group Name',
      modifyName: 'Modify Group Name',
      quit: 'Quit Group',
      mute: 'Mute',
      pin: 'Pin',
      notice: 'Group Notice',
      cleanHistory: 'Clean History Message',
      cleanTips: 'Are you sure to clean this chat\'s history messages?',
      cleanConfirm: 'Clean',
      complain: 'Complain',
    }
  }
}