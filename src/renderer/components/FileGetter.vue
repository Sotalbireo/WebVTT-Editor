<template>
  <div
    class="ui center aligned placeholder segment"
    @dragover="handleDragOver"
    @drop="handleFileDrop"
  >
    <div class="ui icon header">
      <i class="outline icon" :class="iconType" />
      {{ placeholder }}
    </div>
    <p>または以下からファイルを選択</p>
    <div class="ui fluid icon input">
      <input
        type="file"
        @change="handleFileSelect"
      >
      <i class="file outline icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

@Component
export default class FileGetter extends Vue {
  @Prop({ type: String, default: 'ここにファイルをドロップ' }) readonly placeholder!: string
  @Prop({ type: String, default: 'file' }) readonly iconType!: string
  @Action('setPath') actSetPath

  handleDragOver = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
  }
  handleFileDrop = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const files = <FileList>e.dataTransfer.files
    const includeVideoFile = Array.from(files).some(f => /^video\//i.test(f.type))

    if (includeVideoFile && files.length > 1) {
      alert('動画ファイルは1つだけドロップしてください')
      return
    } else if (files.length > 1) {
      alert('現在、字幕ファイルの同時読込は1件のみです')
      return
    }
    this.actSetPath(files)
  }
  handleFileSelect = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const files = <FileList>e.target.files
    const includeVideoFile = Array.from(files).some(f => /^video\//i.test(f.type))

    if (includeVideoFile && files.length > 1) {
      alert('動画ファイルは1つだけ選択してください')
      return
    } else if (files.length > 1) {
      alert('現在、字幕ファイルの同時読込は1件のみです')
      return
    }
    this.actSetPath(files)
  }
}
</script>

<style lang="sass" scoped>
.ui.placeholder.segment
  width: 100%
#dropZoneOuter
  padding: 10px
  border: 1px solid #ccc
#drop_zone
  padding: 25px
  border: 2px dashed #bbb
  border-radius: 5px
  text-align: center
  color: #bbb
</style>
