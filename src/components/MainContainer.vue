<template>
    <div class="ui grid">
        <div class="row">
            <VideoContainer
                id="VideoContainer"
            />
        </div>
        <div class="row">
            <SubtitleEditor
                id="SubtitleEditor"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import VideoContainer from "@/components/VideoContainer.vue";
import SubtitleEditor from "@/components/SubtitleEditor.vue";
export default Vue.extend({
    components: {
        VideoContainer,
        SubtitleEditor
    }
});
</script>

<style lang="sass" >
#VideoContainer
    height: calc(40vh-3.5rem)
#SubtitleEditor
    height: 60vh
    width: 100%
    overflow-x: hidden
    overflow-y: scroll
</style>
