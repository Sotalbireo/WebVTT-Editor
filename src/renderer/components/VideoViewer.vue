<template>
  <section
    class="ui center aligned container"
  >
    <video
      id="Video"
      controls
      preload="auto"
      crossorigin="anonymous"
      :class="platform"
      @loadeddata="videoBind"
    >
      <source :src="videoPath" :type="videoType">
      <template v-if="hasSubtitles">
        <template v-for="(subtitle, i) in subtitles">
          <track
            :key="i"
            kind="subtitles"
            :src="subtitle.blobPath"
            :srclang="subtitle.lang"
            :default="{ default: i === 0 }"
          >
        </template>
      </template>
    </video>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'
import Mousetrap from 'mousetrap'

const nsSubtitle = namespace('subtitle')

@Component
export default class VideoViewer extends Vue {
  @Getter videoPath
  @Getter videoType
  @nsSubtitle.Getter hasSubtitles
  @nsSubtitle.Getter subtitles
  platform = 'test'

  videoElement?: HTMLVideoElement

  videoBind = (e) => {
    this.videoElement = e.target as HTMLVideoElement
    Mousetrap.bind('space', () => this.pp())
    Mousetrap.bind('shift+z', () => this.seek(-3600))
    Mousetrap.bind('z', () => this.seek(-60))
    Mousetrap.bind('x', () => this.seek(-10))
    Mousetrap.bind('left', () => this.seekByFrame(-1))
    Mousetrap.bind('right', () => this.seekByFrame(1))
    Mousetrap.bind('c', () => this.seek(10))
    Mousetrap.bind('v', () => this.seek(60))
    Mousetrap.bind('shift+v', () => this.seek(3600))
  }

  /**
   * Second Per Frame (means: 1 / fps)
   */
  private spf = 1 / 60

  /**
   * Gets the current playback position, in seconds.
   */
  get currentTime() : number {
    return this.videoElement!.currentTime
  }

  /**
   * Play/Pause
   */
  pp = () => {
    if (this.videoElement!.paused || this.videoElement!.ended) {
      this.videoElement!.play()
    } else {
      this.videoElement!.pause()
    }
  }

  /**
   * Video seeking
   * @param second Negative values also available
   */
  seek = (second: number) => {
    this.videoElement!.currentTime += second
  }

  /**
   * Video seeking (unit: frame)
   * @param frame Negative values also available
   */
  seekByFrame = (frame: number) => {
    this.videoElement!.currentTime += frame * this.spf
  }
}
</script>

<style lang="sass" scoped>
video
    max-height: 100%
.vimeo
    font-family: "Helvetica Neue",Helvetica,Arial!important
.youtube
</style>
