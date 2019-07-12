<template>
  <div>
    <div
      class="ui top attached compact segment"
      @dragover="handleDragOver"
      @drop="handleFileDrop"
    >
      <div class="ui icon header">
        <i class="outline icon" :class="iconType" />
        {{ placeholder }}
      </div>
    </div>
    <label class="ui bottom attached labeled icon olive button">
      <i class="file outline icon" />
      ファイルを選択
      <input type="file" @change="handleFileSelect">
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'

type readableFilesMimeTypes = "video/*" | "text/vtt"

@Component
export default class FileGetter extends Vue {
  @Prop({ type: String, default: 'ファイルをドロップ' })
  readonly placeholder!: string
  @Prop({ type: String, default: 'file' }) readonly iconType!: string
  @Prop({ type: String }) readonly readableFilesMimeTypes!: readableFilesMimeTypes
  @Action setResource

  handleDragOver = (e) => {
    e.stopPropagation()
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy' // Explicitly show this is a copy.
  };
  handleFileDrop = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const files = <FileList>e.dataTransfer.files
    const includeVideoFile = Array.from(files).some(f =>
      /^video\//i.test(f.type)
    )

    if (includeVideoFile && files.length > 1) {
      alert('動画ファイルは1つだけドロップしてください')
      return
    } else if (files.length > 1) {
      alert('現在、字幕ファイルの同時読込は1件のみです')
      return
    }
    this.setResource(files)
  };
  handleFileSelect = (e) => {
    e.stopPropagation()
    e.preventDefault()

    const files = <FileList>e.target.files
    if (!this.isFileBeRequestedType(this.readableFilesMimeTypes, files)) {
      alert('対応したファイルを選択してください')
      return
    } else if (files.length > 1) {
      alert('ファイルは1つだけ選択してください')
      return
    }

    this.setResource(files)
  };

  isFileBeRequestedType = (type: readableFilesMimeTypes, file: File | FileList): boolean => {
    const hasTypeWildcard = type.substr(-1) === '*'
    const reToTypeCheck = new RegExp(hasTypeWildcard ? `^${type.substr(0, type.length - 1)}+*$` : `^${type}$`, 'i')
    if (file instanceof FileList) {
      return [...Object.keys(file)].some(k => reToTypeCheck.test(file[k].type))
    } else {
      return reToTypeCheck.test(file.type)
    }
  }
}
</script>

<style lang="sass" scoped>
input[type="file"]
  display: none
.ui.placeholder.segment
  width: 100%
</style>
