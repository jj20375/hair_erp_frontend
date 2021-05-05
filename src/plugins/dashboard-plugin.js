// Notifications plugin. Used on Notifications page
import Notifications from "../components/NotificationPlugin";
// A plugin file where you could register global components used across the app
import GlobalComponents from './globalComponents';
// A plugin file where you could register global directives
import GlobalDirectives from './globalDirectives';
// Sidebar on the right. Used as a local plugin in DashboardLayout.vue
import SideBar from "../components/SidebarPlugin/index";


// asset imports
// import '@/assets/sass/argon.scss';
// import '@/assets/css/nucleo/css/nucleo.css';
// import { extend } from 'vee-validate';
// import * as rules from 'vee-validate/dist/rules';
// import { messages } from 'vee-validate/dist/locale/en.json';

// Object.keys(rules).forEach(rule => {
//   extend(rule, {
//     ...rules[rule], // copies rule configuration
//     message: messages[rule] // assign message
//   });
// });
export default {
  install(Vue) {
    Vue.use(GlobalComponents);
    Vue.use(GlobalDirectives);
    Vue.use(Notifications);
    Vue.use(SideBar);
    // configure({
    //   classes: {
    //     valid: 'is-valid',
    //     invalid: 'is-invalid',
    //     dirty: ['is-dirty', 'is-dirty'], // multiple classes per flag!
    //   }
    // })
  }
};
