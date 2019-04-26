<template>
  <div id="Body" class="ui grid">
    <SideNavigation
      id="SideNavigation"
      class="one wide column"
    />
    <MainContainer
      class="thirteen wide column"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SideNavigation from '~/components/SideNavigation.vue'
import MainContainer from '~/components/MainContainer.vue'

@Component({
  components: {
    SideNavigation,
    MainContainer
  }
})
export default class Index extends Vue {}
</script>

<style lang="sass">
body
    overflow: hidden
    margin-top: 1rem
ul.ui.list
    margin: 0
ul.ui.list li:before
    content: ""
#Body
  height: 100vh
#SideNavigation
  padding-right: 0
</style>
