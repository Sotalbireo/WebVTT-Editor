/* eslint no-console:0 */
export const state = () => ({
  videoPath: '',
  videoType: '',

  subtitlesAbsolutePath: [],
  subtitles: []
})

export const getters = {
  hasVideoPath: state => state.videoPath !== '',
  videoPath: state => state.videoPath,
  videoType: state => state.videoType,
  hasSubtitles: state => state.subtitles.length > 0,
  subtitlesAbsolutePath: state => state.subtitlesAbsolutePath,
  subtitlesLang: state => state.subtitlesLang,
  subtitles: state => state.subtitles
}

export const actions = {
  setPath: (context, fileList: FileList) => {
    if (fileList.length === 1 && /^video\//i.test(fileList[0].type)) {
      context.commit('setVideoPath', fileList[0])
    } else if (Array.from(fileList).every(fb => /\.vtt$/i.test(fb.name))) {
      context.commit('setSubtitlePath', fileList)
    } else {
      console.dir(fileList)
      alert('未対応のファイル形式です')
    }
  }
}

export const mutations = {
  setVideoPath: (state, payload: File) => {
    state.videoPath = window.URL.createObjectURL(payload)
    state.videoType = payload.type
  },
  setSubtitlePath: (state, fileList: FileList) => {
    state.subtitlesAbsolutePath.splice(0)
    state.subtitles.splice(0)
    Array.from(fileList).forEach((file) => {
      const blobPath = window.URL.createObjectURL(file)
      state.subtitlesAbsolutePath.push(file.path)
      const lang = (file.name.match(/^.*\.(.*?)\.vtt$/) || [''])[0]
      state.subtitles.push({
        blobPath,
        path: file.path,
        lang
      })
    })
  }
}
