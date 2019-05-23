<template>
  <section>
    <div class="ui form">
      <div class="field">
        <textarea
          id="RawEditor"
          v-model="rawString"
          name=""
          autocomplete="off"
          rows=""
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

@Component
export default class RawEditor extends Vue {
  @Getter hasSubtitles
  @nsSubtitle.Getter subtitles
  @nsSubtitle.Action save
  @nsSubtitle.Action update

  rawString = ''
  videosCurrentPos = ''
  insertedNotesLength: number[] = []

  /**
   * Insert note
   * (Replace from "<timestamp>" to Videos current playback position)
   */
  insertNote(str: string) {
    this.$emit('get-videos-currentpos')
    const note = str.replace(/<timestamp>/g, this.videosCurrentPos)
    if (this.insertedNotesLength.length > 9) {
      this.insertedNotesLength.splice(0, 1)
    }
    this.insertedNotesLength.push(note.length)
    this.rawString += note
  }

  mounted() {
    this.rawString = readFileSync(this.subtitles[0].path, 'utf8').trim()

    /**
     * Save vtt file
     */
    Mousetrap.bind(['ctrl+s', 'command+s'], () => {
      this.save({ newdata: this.rawString })
      this.update()
    })

    /**
     * Insert begin cue
     */
    Mousetrap.bind('j', () => this.insertNote((this.rawString.slice(-1) !== `\n` ? `\n` : ``) + `\n<timestamp> -->`))

    /**
     * Insert end cue & next begin cue
     */
    Mousetrap.bind('k', () => this.insertNote(` <timestamp>\n[subtitle]\n\n<timestamp> -->`))

    /**
     * Insert end cue and provisional note
     */
    Mousetrap.bind('l', () => this.insertNote(` <timestamp>\n[subtitle]\n`))

    /**
     * Delete insert value
     */
    Mousetrap.bind('y', () => {
      if (this.insertedNotesLength.length === 0) return
      this.rawString = this.rawString.slice(0, -1 * this.insertedNotesLength.splice(-1)[0])
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
  &:focus
    box-shadow: 0 0 6px 2px #85b7d9 !important
</style>
