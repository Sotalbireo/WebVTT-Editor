<template>
  <section>
    <div class="ui form">
      <div class="field">
        <textarea
          id=""
          name=""
          autocomplete="off"
          rows=""
          :value="vtt"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { readFileSync } from 'fs'
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'

@Component
export default class RawEditor extends Vue {
  @Getter hasSubtitles
  @Getter subtitlesAbsolutePath
  vtt = ''
  mounted() {
    this.vtt = readFileSync(this.subtitlesAbsolutePath[0], 'utf8')
  }
}
</script>

<style lang="sass" scoped>
*
  height: 100%
  width: 100%
  max-height: 100%
  min-height: 100%
textarea
  resize: none
</style>
