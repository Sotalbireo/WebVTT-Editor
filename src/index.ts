import Vue from "vue";
//@ts-ignore
import Root from "./Root.vue";
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
    el: "#root",
    components: { Root },
    template: "<Root/>"
});
