<template>
  <div class="ui centered grid">
    <div id="UpperContent" class="row">
      <template v-if="this.hasVideoPath">
        <VideoViewer />
      </template>
      <template v-else>
        <FileGetter
          icon-type="video file"
          placeholder="ここに参照したい動画ファイルをドロップ"
        />
      </template>
    </div>
    <div id="LowerContent" class="row">
      <template v-if="this.hasSubtitles">
        <RawEditor />
      </template>
      <template v-else>
        <FileGetter
          icon-type="closed captioning"
          placeholder="ここに編集したい字幕ファイル(vtt)をドロップ"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import VideoViewer from '~/components/VideoViewer.vue'
import RawEditor from '~/components/subtitles/RawEditor.vue'
import FileGetter from '~/components/FileGetter.vue'

@Component({
  components: {
    VideoViewer,
    FileGetter,
    RawEditor
  }
})
export default class MainContainer extends Vue {
  @Getter hasVideoPath
  @Getter hasSubtitles
}
</script>

<style lang="sass">
#UpperContent
  height: 35%

#LowerContent
  height: 65%
</style>
