<template>
  <div class="">
      <button :class='cls' @click='$refs.fileInput.click()'>{{btn_text}}</button>
    <input type="file" @change="loadTextFromFile" ref="fileInput" v-show='false'>
  </div>
</template>

<script>
import { stridedSlice } from '@tensorflow/tfjs-core';
export default {
  props: {
    cls: {
      type: String,
      required: false,
      default: ''
    },
    btn_text: {
      type: String,
      required: false,
      default: 'Select File'
    }
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = e => this.$emit("load", e.target.result);
      reader.readAsText(file);
    }
  }
};
</script>