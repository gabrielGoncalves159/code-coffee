import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueTheMask from 'vue-the-mask';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTrash,  faPenToSquare} from '@fortawesome/free-solid-svg-icons'

library.add(faTrash, faPenToSquare)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(VueTheMask).use(store).use(router).mount('#app')
