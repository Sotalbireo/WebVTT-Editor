<template>
    <div class="ui grid">
        <SideNavigation
            class="two wide column"
        />
        <MainContainer
            class="twelve wide column"
        />
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import SideNavigation from "@/components/SideNavigation.vue";
import MainContainer from "@/components/MainContainer.vue";
export default Vue.extend({
    components: {
        SideNavigation,
        MainContainer
    }
});
</script>

<style lang="sass">
$icons-font-path: "~semantic-ui-sass/icons" !default
$flags-image-path: "~semantic-ui-sass/images" !default
$import-google-fonts: false
@import "semantic-ui-sass/semantic-ui.scss"
body
    overflow: hidden
    margin-top: 1rem
ul.ui.list
    margin: 0
ul.ui.list li:before
    content: ""
</style>
