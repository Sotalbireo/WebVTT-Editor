/* eslint no-console:0 */
export const state = () => ({
  videoPath: '',
  videoType: ''
})

export const getters = {
  hasVideoPath: state => state.videoPath !== '',
  videoPath: state => state.videoPath,
  videoType: state => state.videoType
}

export const actions = {
  setResource: (context, fileList: FileList) => {
    if (fileList.length === 1 && /^video\//i.test(fileList[0].type)) {
      context.commit('setVideoPath', fileList[0])
    } else if (Array.from(fileList).every(fb => /\.vtt$/i.test(fb.name))) {
      context.commit('subtitle/setResource', fileList, { root: true })
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
  }
}
