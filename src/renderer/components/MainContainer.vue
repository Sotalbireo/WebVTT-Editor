<template>
  <div class="ui centered grid">
    <div id="UpperContent" class="row">
      <template v-if="hasVideoPath">
        <VideoViewer
          ref="video"
        />
      </template>
      <template v-else>
        <FileGetter
          icon-type="video file"
          placeholder="動画ファイルをドロップ"
        />
      </template>
    </div>
    <div id="LowerContent" class="row">
      <template v-if="hasSubtitles">
        <RawEditor
          ref="editor"
          @get-videos-currentpos="getVideosCurrentPos"
        />
      </template>
      <template v-else>
        <FileGetter
          icon-type="closed captioning"
          placeholder="字幕ファイル(vtt)をドロップ"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'
import VideoViewer from '~/components/VideoViewer.vue'
import RawEditor from '~/components/subtitles/RawEditor.vue'
import FileGetter from '~/components/FileGetter.vue'

const nsSubtitle = namespace('subtitle')

@Component({
  components: {
    VideoViewer,
    FileGetter,
    RawEditor
  }
})
export default class MainContainer extends Vue {
  @Getter hasVideoPath
  @nsSubtitle.Getter hasSubtitles

  videoCurrentTime = 0

  getVideosCurrentPos() {
    (this.$refs.editor as RawEditor).videosCurrentPos = (this.$refs.video as VideoViewer).readableCurrentTime()
  }
}
</script>

<style lang="sass">
#UpperContent
  height: 35%

#LowerContent
  height: 65%
</style>
