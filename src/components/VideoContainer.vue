<template>
    <section
        class="ui center aligned container"
    >
        <video
            id="Video"
            controls
            preload="auto"
            width="auto"
            height="auto"
            crossorigin="anonymous"
            :class="platform"
        >
            <source :src="videoSrc" :type="videoMime" />
            <template v-for="(subtitle, i) in subtitles">
                <track
                    :key="i"
                    :label="subtitle.label"
                    kind="subtitles"
                    :src="subtitle.src"
                    :srclang="subtitle.lang"
                    :default="{ default: i === 0 }"
                />
            </template>
        </video>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import readChunk from "read-chunk"
import fileType from "file-type"
import {resolve} from "path"

const mimetype = (fileType(readChunk.sync(resolve("src/assets/sample.mp4"), 0, fileType.minimumBytes)) || {mime:"video"}).mime

interface Subtitle {
    label: string;
    src: string;
    lang: string;
}

export default Vue.extend({
    data: () => ({
        platform: "test",
        videoSrc: "assets/sample.mp4",
        videoMime: mimetype,
        subtitles: [
            {
                label: "en",
                src: "assets/sample.en.vtt",
                lang: "en"
            }
        ]
    })
});
</script>

<style lang="sass" scoped>
video
    height: 100%
.vimeo
    font-family: "Helvetica Neue",Helvetica,Arial!important
</style>
