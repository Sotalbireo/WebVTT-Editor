/* eslint no-unused-vars:0 */
import NuxtConfiguration from '@nuxt/config'

const nuxtConfig: NuxtConfiguration = {
  mode: 'universal',
  srcDir: 'src/renderer',
  buildDir: 'dist/.nuxt',
  generate: {
    dir: 'dist/renderer'
  },

  head: {
    title: 'WebVTT Editor',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }
    ]
  },

  loading: { color: '#fff' },
  modules: [
    '@nuxtjs/axios'
  ],

  build: {
    extend(config, { isClient, isDev }) {
      config.target = 'electron-renderer'
      if (isDev && isClient) {
        config.module!.rules.push({
          enforce: 'pre',
          test: /\.(js|ts|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            fix: true,
            quiet: true
          }
        })
      }
    },
    loaders: {
      sass: {
        implementation: require('sass'),
        fiber: require('fibers')
      }
    },
    parallel: true
  },
  css: ['~/assets/main.sass']
}

export default nuxtConfig
