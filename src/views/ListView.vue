<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">事項</h1>
      </v-col>
      <v-col cols="12">
        <v-text-field
        clearable
        variant="solo-filled"
        label="新增事項"
        v-model="newItem"
        :rules="[rules.required, rules.length]"
        append-icon="mdi-plus"
        ref="newItemInput"
        @click:append="onInputSubmit"
        @keydown.enter="onInputSubmit"
        ></v-text-field>
        <!-- :rules => vuetify驗證功能 要寫成驗證function的陣列 -->
        <!-- append-icon: 有四種位置 https://vuetifyjs.com/en/components/text-fields/#icons -->
        <!-- @click:append => 點擊 append的icon時就會送出 -->
        <!-- 要手動呼叫驗證 -->
        <v-table hover>
          <thead>
            <tr>
              <th>名稱</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="item.id">
              <td>
                <!-- !item.edit 非編輯時 show -->
                <span v-show="!item.edit">{{ item.name }}</span>
                <!-- 編輯時的輸入欄位 -->
                <v-text-field
                  v-show="item.edit"
                  v-model="item.model"
                  :rules="[rules.required, rules.length]"
                  ref="editItemInput"
                  @keydown.enter="onEditInputSubmit(item.id, i)"
                  autofocus
                ></v-text-field>
                <!-- 綁 editItemInput -->
                <!-- autofoucs => vuetify v-text-field的功能，可以自動focus -->
              </td>
              <td>
                <!-- 非編輯時的按鈕 -->
                <template v-if="!item.edit">
                  <!-- <v-btn icon="mdi-pencil" variant="text" color="green" @click="item.edit = true"></v-btn> -->
                  <v-btn icon="mdi-pencil" variant="text" color="green" @click="editItem(item.id)"></v-btn>
                  <v-btn icon="mdi-delete" variant="text" color="red" @click="delItem(item.id)"></v-btn>
                </template>
                <!-- 編輯時的按鈕 -->
                <template v-else>
                  <v-btn icon="mdi-check" variant="text" color="green" @click="onEditInputSubmit(item.id, i)"></v-btn>
                  <v-btn icon="mdi-undo" variant="text" color="red" @click="cancelEditItem(item.id)"></v-btn>
                </template>
              </td>
            </tr>
            <tr v-if="items.length === 0">
              <td colspan="2">沒有事項</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">已完成事項</h1>
      </v-col>
      <v-col cols="12">
        <v-table hover>
          <thead>
            <tr>
              <td>名稱</td>
              <td>操作</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in finishedItems" :key="item.id">
              <td>{{ item.name }}</td>
              <td>
                <v-btn icon="mdi-delete" variant="text" color="red" @click="delFinishedItem(item.id)"></v-btn>
              </td>
            </tr>
            <tr v-if="finishedItems.length === 0">
              <td colspan="2">沒有已完成事項</td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useListStore } from '@/store/list'
import { storeToRefs } from 'pinia'

const list = useListStore()
const { items, finishedItems } = storeToRefs(list)
// function不會改變 不需要使用響應式
const { addItem, editItem, delItem, cancelEditItem, confirmEditItem, delFinishedItem } = list

// 動態監聽 和輸入欄位綁定 接收使用者輸入的字串
const newItem = ref('')
// 要給一個同名的ref，預設是null，在onMounted後才會有內容 => 呼叫元件內的function做事
const newItemInput = ref(null)
// 給同名的ref
const editItemInput = ref([])

const onInputSubmit = async () => {
  const validate = await newItemInput.value.validate()
  console.log(validate)
  if (validate.length > 0) return
  addItem(newItem.value)
  newItemInput.value.reset()
}

const onEditInputSubmit = async (id, i) => {
  const validate = await editItemInput.value[i].validate()
  if (validate.length > 0) return
  confirmEditItem(id)
}

// 驗證functions
const rules = {
  // 官方文件寫法
  // required: value => !!value || 'Field is required'
  // required: (value) => {
  //   return !!value || 'Field is required'
  // }
  required: (value) => {
    // Boolean(): 如果有輸入文字 => 值式true; 如果沒傳值，或者是0、-0、null、false、NaN、undefined、空字串("")的話 => 值會變成 false
    return Boolean(value) || '欄位必填'
  },
  length: (value) => {
    return value.length >= 3 || '必須三個字以上'
  }
}
</script>
