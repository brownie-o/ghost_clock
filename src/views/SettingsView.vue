<template>
  <v-container>
    <!-- https://vuetifyjs.com/en/components/grids/#caveats -->
    <!-- https://vuetifyjs.com/en/api/v-col/#links -->
    <v-row>
      <v-col cols="12">
        <h1 class="text-center">通知設定</h1>
      </v-col>
      <v-col cols="12">
        <v-radio-group inline v-model="notify">
          <v-radio label="開啟" :value="true"></v-radio>
          <v-radio label="關閉" :value="false"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="12">
        <h1 class="text-center">鈴聲設定</h1>
      </v-col>
      <v-col cols="12">
        <v-table hover>
          <thead text-center>
            <tr>
              <th>名稱</th>
              <th>試聽</th>
              <th>選擇</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alarm in alarms" :key="alarm.id">
              <td>{{ alarm.name }}</td>
              <td>
                <!-- controls = 瀏覽器的UI -->
                <audio :src="alarm.file" controls></audio>
              </td>
              <td>
                <!-- https://vuetifyjs.com/en/components/radio-buttons/#usage -->
                <v-radio-group v-model="selectedAlarm">
                  <v-radio :value="alarm.id"></v-radio>
                </v-radio-group>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useSettingsStore } from '@/store/settings'
// 使用storeToRefs輔助 解構時才能維持響應性
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()
const { alarms, selectedAlarm, notify } = storeToRefs(settings)
</script>

<style scoped>
/* 當有使用scoped(僅修改本頁面的原件)且需要調整元件內的元件的樣式時 可以使用:deep去取到元件內的元件 */
:deep(.v-selection-control-group.v-selection-control-group--inline){
  margin: auto;
}

.settings{
  vertical-align: middle;
}
</style>
