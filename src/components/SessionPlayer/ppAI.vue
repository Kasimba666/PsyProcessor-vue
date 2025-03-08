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

export default {
  name: "AiPromptComponent",
  props: {
    promptJson: {
      type: Object,
      required: true,
      validator(value) {
        return (
            value.hasOwnProperty("originalText") &&
            value.hasOwnProperty("substitutions")
        );
      },
    },
  },
  data() {
    return {
      systemPrompt: "In this object we have a string \"originalText\" that contains variables starting with the $ symbol, enclosed between the substrings \"startSubstr\" and \"endSubstr\".\n" +
          "The variables should be replaced with values from the \"substitution\" object while preserving the \"startSubstr\" and \"endSubstr\" substrings.\n" +
          "It is important that the substitutions remain grammatically correct within the sentence.\n",
      selectedSource: "Ollama",
      selectedModel: "",
      availableModels: [],
      responseHistory: [],
      loading: false,
    };
  },
  watch: {
    selectedSource(newSource) {
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
        const url = "http://192.168.0.100:1234/api/models";
        axios
            .get(url)
            .then((response) => {
              this.availableModels = response.data.models || [];
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

      if (this.selectedSource === "Ollama") {
        const ollama = new Ollama({ host: OLLAMA_HOST });
        // console.log(JSON.stringify(...this.promptJson));
        const payload = {
          model: this.selectedModel,
          messages: [
            { role: "user", content: '"' + JSON.stringify(this.promptJson) + '"' + this.systemPrompt },
          ],
          stream: false,
        };
        // console.log(this.systemPrompt + JSON.stringify(this.promptJson));
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
        // const url = "http://192.168.0.100:1234/api/generate";
        // axios
        //     .post(url, requestData)
        //     .then((response) => {
        //       const responseTime = Date.now() - startTime;
        //       this.responseHistory.unshift({
        //         response: response.data.response,
        //         modelUsed: this.selectedModel,
        //         responseTime,
        //         expanded: false,
        //       });
        //       this.loading = false;
        //     })
        //     .catch(() => {
        //       this.responseHistory.unshift({
        //         response: "Ошибка запроса",
        //         modelUsed: this.selectedModel,
        //         responseTime: "-",
        //         expanded: false,
        //       });
        //       this.loading = false;
        //     });
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
