<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-hover>
          <template v-slot:default="{ isHovering, props }">
            <v-card v-bind="props" :color="isHovering ? '#F4F4F4' : undefined">
              <h1>{{ currentText }}</h1>
              <h1>{{ currentTime }}</h1>
            </v-card>
          </template>
        </v-hover>
      </v-col>
      <v-col cols="12">
        <!-- 狀態是倒數中的時後停用開始按鈕 -->
        <v-btn variant="text" icon="mdi-play"
          :disabled="status === STATUS.COUNTING || (currentItem.length === 0 && items.length === 0)"
          @click="startTimer"></v-btn>
        <!-- 狀態不是倒數中 不可以按暫停  -->
        <v-btn variant="text" icon="mdi-pause" :disabled="status !== STATUS.COUNTING" @click="pauseTimer"></v-btn>
        <v-btn variant="text" icon="mdi-skip-next" :disabled="currentItem.length === 0" @click="finishTimer"></v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <v-textarea clearable label="Notes"></v-textarea>
          <v-card-actions>
            <v-btn>Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="ms-auto">
        <iframe width="400" height="225"
          src="https://www.youtube-nocookie.com/embed/videoseries?si=SM6tE31ktEkKyslp&amp;list=PL5OaXMC1xIlS6ZItNdZvuiEbEBhB3UrJ2"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen></iframe>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useListStore } from '@/store/list'
import { useSettingsStore } from '@/store/settings'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useWebNotification } from '@vueuse/core'

const list = useListStore()
const { currentItem, items, timeleft } = storeToRefs(list)
const { setCurrentItem, countdown, setFinishedItem } = list

const settings = useSettingsStore()
const { selectedAlarmFile, notify } = storeToRefs(settings)

// typescript 狀態碼 可讀性較高(每個狀態都有名字)
const STATUS = {
  STOP: 0,
  COUNTING: 1,
  PAUSE: 2
}

const status = ref(STATUS.STOP)

// 因為setTimer & setInterval回傳的值是數字 所以先設timer = 0 (數字)
let timer = 0
const startTimer = () => {
  // 如果是停止的狀況下開始 並且有待辦事項
  if (status.value === STATUS.STOP && items.value.length > 0) {
    setCurrentItem()
  }

  status.value = STATUS.COUNTING

  timer = setInterval(() => {
    console.log('timer')
    countdown()
    if (timeleft.value === 0) {
      finishTimer()
    }
  }, 1000)
}

const pauseTimer = () => {
  status.value = STATUS.PAUSE
  clearInterval(timer)
}

const finishTimer = () => {
  clearInterval(timer)
  status.value = STATUS.STOP

  // 建立js音訊物件 然後播放
  const audio = new Audio()
  audio.src = selectedAlarmFile.value
  audio.play()

  if (notify.value) {
    const { show, isSupported } = useWebNotification({
      title: '事項完成',
      body: currentText.value,
      icon: new URL('@/assets/sick_ghost.png', import.meta.url).href
    })
    if (isSupported.value) {
      show()
    }
  }

  setFinishedItem()

  if (items.value.length > 0) {
    startTimer()
  }
}

// 也可以寫成getters = 取資料的function
const currentText = computed(() => {
  if (currentItem.value.length > 0) {
    return currentItem.value
  } else if (items.value.length > 0) {
    return '點擊開始'
  } else {
    return '沒有事項'
  }
})

const currentTime = computed(() => {
  const m = Math.floor(timeleft.value / 60).toString().padStart(2, '0')
  const s = (timeleft.value % 60).toString().padStart(2, '0')
  return m + ':' + s
})

</script>
