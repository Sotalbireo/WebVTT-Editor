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
    >
      <source :src="this.videoPath" :type="this.videoType">
      <template v-if="this.hasSubtitles">
        <template v-for="(subtitle, i) in this.subtitles">
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

const nsSubtitle = namespace('subtitle')

@Component
export default class VideoContainer extends Vue {
  @Getter videoPath
  @Getter videoType
  @nsSubtitle.Getter hasSubtitles
  @nsSubtitle.Getter subtitles
  platform = 'test'
}
</script>

<style lang="sass" scoped>
video
    max-height: 100%
.vimeo
    font-family: "Helvetica Neue",Helvetica,Arial!important
</style>
