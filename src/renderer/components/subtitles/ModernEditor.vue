<template>
  <section>
    <ul class="ui relaxed celled list">
      <!-- <template v-for="(cue, idx) in cues">
        <li :key="idx" class="item">
          <div class="right floated content">
            <button class="ui icon button" disabled>
              <i class="cog icon" />
            </button>
          </div>
          <div class="header">
            {{ cue.begin }} -- > {{ cue.end }}
            <span :v-if="cue.option">{{ cue.option }}</span>
          </div>
          {{ cue.note }}
        </li>
      </template> -->
    </ul>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import fs from 'fs'
import jschardet from 'jschardet'
import Log from '~/middleware/Log'
interface Cue {
  begin: string
  end: string
  option?: string
  note: string
}

export class Parser {
  private lineTerminator: 'crlf'|'lf'|'cr'
  cues?: Cue[]
  str: string

  constructor(filepath: string) {
    const fd = fs.openSync(filepath, 'r')
    const bin = Buffer.alloc(10)
    fs.readSync(fd, bin, 0, 10, 0)
    fs.closeSync(fd)
    // console.dir(bin)
    this.str = fs.readFileSync(filepath, 'utf-8')

    const encoding = jschardet.detect(this.str).encoding.toLowerCase()
    if (encoding !== 'utf-8' && encoding !== 'ascii') {
      Log.notUTF8(encoding)
    }
    this.lineTerminator = /\r\n/im.test(this.str) ? 'crlf' : /\r/im.test(this.str) ? 'cr' : 'lf'

    this.parser()
  }

  parser() {
  // すべての「U+0000」を「U+FFFD」で置換, 改行をlfに統一
    this.str = this.str.replace('\u0000', '\uFFFD').replace(/\r\n?/ig, '\n')
    // ファイルが6文字以上あり、かつファイル先頭6字が「WEBVTT」であることを確認する（偽なら終了）
    // ファイル先頭の7文字が「U+0020( )」「U+0009(\t)」「U+000A(\n)」以外だった場合終了
    if (this.str.length < 6 || !/^WEBVTT[\u0020\t\n]/.test(this.str.substr(0, 7))) {
      Log.notExistSignature()
      return
    }
    // 8文字目以降の改行を除く最初の文字が存在しない場合終了
    if (!/\w/.test(this.str.substr(7))) return
  }

  setCues = () => {
    const reA = /^(?:\d{2,}:)?\d{2}:\d{2}\.\d{3} --> (?:\d{2,}:)?\d{2}:\d{2}\.\d{3}(?:[^\n]+)?\n[\s\S]+?(?=((?:\d{2,}:)?\d{2}:\d{2}\.\d{3})|$(?!\s))/gm
    const reB = /^(?<begin>(?:\d{2,}:)?\d{2}:\d{2}\.\d{3}) --> (?<end>(?:\d{2,}:)?\d{2}:\d{2}\.\d{3})(?<option>[^\n]+)?\n(?<note>[\s\S]+)$/m
    const cuesFromRawstr = this.str.match(reA)

    if (cuesFromRawstr === null) {
      return
    }
    const cues = cuesFromRawstr.map((cue) => {
      const q = cue.trim().match(reB)
      if (q !== null && q.groups !== undefined) {
        return {
          begin: q.groups.begin,
          end: q.groups.end,
          option: q.groups.option ? q.groups.option : '',
          note: q.groups.note
        }
      } else {
        return { begin: '', end: '', option: '', note: '' }
      }
    })
    this.cues = cues
  }
}

const parser = new Parser('/sample.en.vtt')
parser.setCues()
// console.dir(parser.cues)

@Component
export default class ModernEditor extends Vue {
  // cues: parser.cues
}
</script>

<style lang="sass" scoped>
</style>
