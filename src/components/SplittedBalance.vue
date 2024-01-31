<template>
  <div class='SplittedBalance'>
    <div class='left-part'>{{leftPart}}</div>
    <div class='right-part' :style="{fontSize: 100*rel+'%'}">.{{rightPart || '00'}}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  val: {
    type: String,
    default: '0.00'
  },
  rel: {
    type: Number,
    default: 0.67
  },
  locale: {
      type: String,
      default: 'ru'
  },
});

const splitted = computed(()=>(props?.val ?? '0.00').split('.'));
const leftPart = computed(()=> {
    let result = [];
    let arr = splitted.value[0].split('');
    while (!!arr.length) {
       result.unshift(arr.splice(-3).join(''));
    }
    return result.join(props.locale==='en'+ ? ',' : ' ');
});
const rightPart = computed(()=>splitted.value[1]);


</script>

<style lang='scss'>
/****  SplittedBalance  ****/
.SplittedBalance {
  display: inline-flex;
  align-items: baseline;
  width: auto;
  height: auto;
  .left-part {

  };
}
</style>
