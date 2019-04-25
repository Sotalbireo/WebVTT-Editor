<template>
  <section>
    <div class="ui form">
      <div class="field">
        <textarea
          id="RawEditor"
          name=""
          autocomplete="off"
          rows=""
          :value="vtt"
          class="mousetrap"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { readFileSync } from 'fs'
import { Component, Vue } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'
import Mousetrap from 'mousetrap'

const nsSubtitle = namespace('subtitle')

/* eslint no-console:0 */

@Component
export default class RawEditor extends Vue {
  @Getter hasSubtitles
  @nsSubtitle.Getter subtitles
  @nsSubtitle.Action save

  vtt = ''

  mounted() {
    this.vtt = readFileSync(this.subtitles[0].path, 'utf8')

    Mousetrap.bind(
      ['ctrl+s', 'command+s'],
      (e) => {
        e.stopPropagation()
        e.preventDefault()
        const newdata = (<HTMLTextAreaElement>document.getElementById('RawEditor')!).value
        this.save({ newdata })
      })
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
