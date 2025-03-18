<template>
  <div class="AI">
    <el-card class="ai-component">
      <el-form label-width="140px">
        <el-form-item class="app-el-form-item" label="Системный промт:">
          <el-input
              class="system-prompt-area"
              v-model="systemPrompt"
              placeholder="Введите системный промт"
              type="textarea"
          />
        </el-form-item>
        <div>{{ promptJson }}</div>

        <el-form-item class="app-el-form-item" label="Источник модели:">
          <el-select
              v-model="selectedSource"
              placeholder="Выберите источник"
              @change="fetchModels"
          >
            <el-option label="Ollama" value="Ollama" />
            <el-option label="LMStudio" value="LMStudio" />
          </el-select>
        </el-form-item>
        <el-form-item class="app-el-form-item" label="Выбор модели:">
          <el-select
              v-model="selectedModel"
              placeholder="Выберите модель"
              :disabled="!availableModels.length"
          >
            <el-option
                v-for="model in availableModels"
                :key="model"
                :label="model"
                :value="model"
            />
          </el-select>
        </el-form-item>
        <el-button
            type="primary"
            :disabled="!selectedModel || loading"
            :loading="loading"
            @click="sendRequest"
        >
          Отправить
        </el-button>
      </el-form>

      <el-table :data="responseHistory" style="width: 100%">
        <!-- Колонка с ответом с кнопкой разворота/сжатия -->
        <el-table-column label="Ответ">
          <template #default="{ row }">
            <div class="response-cell" :class="{ expanded: row.expanded }">
              {{ row.response }}
            </div>
            <el-button
                size="small"
                @click="toggleRow(row)"
                style="padding: 0"
            >
              {{ row.expanded ? 'Свернуть' : 'Развернуть' }}
            </el-button>
          </template>
        </el-table-column>
        <!-- Колонка модели шириной 120px -->
        <el-table-column prop="modelUsed" label="Модель" width="120" />
        <!-- Колонка времени ответа шириной 80px -->
        <el-table-column prop="responseTime" label="Время (мс)" width="80" />
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { Ollama } from "ollama";
import axios from "axios";

const OLLAMA_HOST = "http://192.168.0.100:11434";
const LMSTUDIO_HOST = "http://192.168.0.100:1234";
// const OLLAMA_HOST = "http://localhost:11434";
// const LMSTUDIO_HOST = "http://localhost/v1/models";

export default {
  name: "AiPromptComponent",
  props: {
    promptJson: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      systemPrompt: "This json has a string 'originalText' which contains variables specified in 'variables', starting with the '$' character, enclosed between the substrings 'start_delimiter' and 'start_delimiter'.\n" +
          "Replace each variable in 'originalText' with its corresponding value from 'variables', following the grammar rules. When substituting values, replace the words 'я' with 'ты', 'мне' or 'себе' with 'тебе', 'меня' or 'себя' with 'тебя'. The resulting sentence must be syntactically correct.\n" +
          "The response must contain only the received string without any additional explanations or comments.",
      selectedSource: "Ollama",
      selectedModel: "",
      availableModels: [],
      responseHistory: [],
      loading: false,
    };
  },
  watch: {
    selectedSource(newSource) {
      this.availableModels = [];
      this.fetchModels(newSource);
    },
  },
  mounted() {
    this.fetchModels();
  },
  methods: {
    fetchModels() {
      if (this.selectedSource === "Ollama") {
        const ollama = new Ollama({ host: OLLAMA_HOST });
        ollama
            .list()
            .then((res) => {
              this.availableModels = res.models.map((v) => v.name);
            })
            .catch((err) => {
              console.error(err);
              this.availableModels = [];
            });
      } else if (this.selectedSource === "LMStudio") {
        const url = LMSTUDIO_HOST + '/v1/models';
        axios
            .get(url)
            .then((res) => {
              this.availableModels = res.data.data.map((v) => v.id);
            })
            .catch(() => {
              this.availableModels = [];
            });
      }
    },
    sendRequest() {
      if (!this.selectedModel || !this.selectedSource) return;

      // Устанавливаем блокировку и спиннер
      this.loading = true;
      const requestData = {
        systemPrompt: this.systemPrompt,
        userPrompt: this.promptJson,
      };

      const startTime = Date.now();
      const promptText = JSON.stringify(this.promptJson) + ' ' + this.systemPrompt;
      const payload = {
        model: this.selectedModel,
        messages: [
          { role: "user", content: promptText},
        ],
        temperature: 0.3,
        stream: false,
      };
      if (this.selectedSource === "Ollama") {
        const ollama = new Ollama({ host: OLLAMA_HOST });
        ollama
            .chat(payload)
            .then((response) => {
              const responseTime = Date.now() - startTime;
              this.responseHistory.unshift({
                response: response.message.content,
                modelUsed: this.selectedModel,
                responseTime,
                expanded: false,
              });
              this.loading = false;
            })
            .catch(() => {
              this.responseHistory.unshift({
                response: "Ошибка запроса",
                modelUsed: this.selectedModel,
                responseTime: "-",
                expanded: false,
              });
              this.loading = false;
            });
      } else if (this.selectedSource === "LMStudio") {
        const url = LMSTUDIO_HOST + '/v1/chat/completions';
        axios.post(url, payload)
            .then((response) => {
              const responseTime = Date.now() - startTime;
              this.responseHistory.unshift({
                response: response.data.choices[0].message.content,
                modelUsed: this.selectedModel,
                responseTime,
                expanded: false,
              });
              this.loading = false;
            })
            .catch(() => {
              this.responseHistory.unshift({
                response: "Ошибка запроса",
                modelUsed: this.selectedModel,
                responseTime: "-",
                expanded: false,
              });
              this.loading = false;
            });
      }
    },
    toggleRow(row) {
      row.expanded = !row.expanded;
    },
  },
};
</script>

<style lang="scss" scoped>
.AI {
   width: 100%;
  .ai-component {
    background-color: hsl(190, 90%, 90%);
    .app-el-form-item {
      margin-bottom: 3px;
    }
    .system-prompt-area {
      /* При необходимости можно задать размеры области ввода */
    }
    .el-table {
      margin-top: 20px;
    }
  }
}

.response-cell {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  transition: all 0.3s ease;
}

.response-cell.expanded {
  -webkit-line-clamp: unset;
  white-space: normal;
}


</style>
