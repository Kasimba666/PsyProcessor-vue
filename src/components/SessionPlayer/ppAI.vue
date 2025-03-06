<template>
  <div class="AI">
    <el-card>
          <el-radio-group v-model="selectedSource">
            <el-radio value="Ollama">Ollama</el-radio>
            <el-radio value="LMStudio">LMStudio</el-radio>
          </el-radio-group>

          <el-select v-model="selectedModel" placeholder="Выберите модель" >
            <el-option v-for="model in availableModels" :key="model" :value="model" />
          </el-select>

<!--      <el-button :disabled="!selectedModel" @click="sendToAI">Отправить</el-button>-->

      <el-card v-if="responseData">
        <p><strong>Ответ:</strong> {{ responseData.response }}</p>
        <p><strong>Модель:</strong> {{ responseData.modelUsed }}</p>
        <p><strong>Время обработки:</strong> {{ responseData.responseTime }} мс</p>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import axios from "axios";
import OpenAI from "openai";
import {Ollama} from 'ollama';

const OLLAMA_API_KEY = 'ollama';
const OLLAMA_HOST = 'http://192.168.0.100:11434';
// const OLLAMA_HOST = 'http://localhost:11434';
const OLLAMA_OPENAPI_ENDPOINT = '/v1';


export default {
  props: {
    promptJson: Object,
  },
  data() {
    return {

      selectedSource: "Ollama",
      selectedModel: "",
      availableModels: [],
      responseData: null,
    };
  },
  watch: {
    selectedSource(newSource) {
      this.fetchModels(newSource);
    },
  },
  mounted() {
    this.fetchModels(this.selectedSource);
  },
  methods: {
    fetchModels(source) {
      if (source === "Ollama") {
        const ollama = new Ollama({ host: OLLAMA_HOST });
        ollama.list()
            .then(res=>{
              this.availableModels = res.models.map((v)=>{return v.name});
              console.log('res.models', res.models.map((v)=>{return v.name}));
            })
            .catch(err=>{
              this.availableModels = [];
            });
        console.log('availableModels', this.availableModels);
      }
    },
    sendToAI() {
      if (!this.promptJson || !this.selectedModel) return;
      const baseUrl = this.selectedSource === "Ollama" ? "192.168.0.100:11434" : "192.168.0.100:1234";
      const startTime = Date.now();

      axios.post(`http://${baseUrl}/api/generate`, {
        prompt: this.promptJson
      }).then(response => {
        this.responseData = {
          response: response.data.response,
          modelUsed: this.selectedModel,
          responseTime: Date.now() - startTime
        };
      }).catch(() => {
        this.responseData = null;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.AI {
  .el-card {
    margin-bottom: 10px;
  }
}
</style>
