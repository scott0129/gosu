import Vue from 'vue';
import VueCookies from 'vue-cookies';
import Root from './Root';

Vue.use(VueCookies);

new Vue({
    el: '#root',
    render: h => h(Root),
});
