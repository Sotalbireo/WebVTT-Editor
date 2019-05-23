<template>
  <div
    class="ui vertical tertiary segment"
  >
    <div class="ui centered grid">
      <div class="row">
        <button class="big ui icon compact button" disabled>
          <i class="file alternate icon" />
        </button>
      </div>
      <div class="row">
        <button
          class="big ui icon compact button"
          disabled
        >
          <i class="building outline icon" />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class SideNavigation extends Vue {}
</script>

<style lang="sass" scoped>
button
  margin-right: 0
</style>
