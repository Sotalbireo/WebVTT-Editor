<template>
  <div class="ui mini modal">
    <div class="header">
      再生プラットフォームを選択する
    </div>
    <div class="content">
      <div class="grouped fields">
        <label for="platform">それっぽいデザインでシミュレートできます</label>
        <div class="field">
          <div class="ui radio checkbox">
            <input type="radio" name="platform" checked="" tabindex="0" class="hidden">
            <label>YouTube</label>
          </div>
        </div>
        <div class="field">
          <div class="ui radio checkbox">
            <input type="radio" name="platform" tabindex="0" class="hidden">
            <label>Vimeo</label>
          </div>
        </div>
      </div>
    </div>
    <div class="actions">
      <div class="ui approve button">
        Approve
      </div>
      <div class="ui cancel button">
        Cancel
      </div>
    </div>
  </div>
</template>
