/* eslint no-console:0 */
import fs from 'fs'
import { base64StringToBlob } from 'blob-util'

type Subtitle = {
  blobPath: string,
  path: string,
  lang: string
}

export const state = () => ({
  subtitles: <Subtitle[]>[],
  selectedIdx: 0
})

export const getters = {
  hasSubtitles: state => state.subtitles.length > 0,
  subtitles: state => state.subtitles
}

export const actions = {
  save: async (context, payload) => {
    await context.commit('writeFile', payload)
  },
  update: (context) => {
    context.commit('updateResource', context.state.selectedIdx)
  }
}

export const mutations = {
  writeFile: (state, payload) => {
    fs.writeFileSync(state.subtitles[0].path, payload.newdata, 'utf8')
  },
  setResource: (state, fileList: FileList) => {
    state.subtitles.splice(0)
    Array.from(fileList).forEach((file) => {
      (<Subtitle[]>state.subtitles).push({
        blobPath: window.URL.createObjectURL(file),
        path: file.path,
        lang: (file.name.match(/^.*\.(.*?)\.vtt$/) || ['', ''])[1]
      })
    })
  },
  updateResource: (state, idx: number) => {
    state.subtitles = (<Subtitle[]>state.subtitles).map((subtitle, i) => {
      if (i === idx) {
        const base64encode = str => btoa(unescape(encodeURIComponent(str)))
        const file = base64StringToBlob(base64encode(fs.readFileSync(subtitle.path, 'utf8')))
        const blobPath = window.URL.createObjectURL(file)
        window.URL.revokeObjectURL(subtitle.blobPath)
        return Object.assign({}, subtitle, { blobPath })
      }
      return subtitle
    })
  }
}
