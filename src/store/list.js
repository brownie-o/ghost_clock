import { defineStore } from 'pinia'

const time = parseInt(import.meta.env.VITE_TIME)
const timeBreak = parseInt(import.meta.env.VITE_TIME_BREAK)

export const useListStore = defineStore('list', {
  state: () => ({
    items: [],
    id: 1,
    timeleft: time,
    break: false,
    finishedItems: [],
    currentItem: ''
  }),
  // 放所有要修改state的function
  actions: {
    addItem (name) {
      // this = state
      this.items.push({
        id: this.id++,
        name,
        edit: false,
        model: name
      })
    },
    findIndexById (id) {
      return this.items.findIndex(item => item.id === id)
    },
    editItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items[i].edit = true
    },
    delItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items.splice(i, 1)
    },
    cancelEditItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items[i].model = this.items[i].name
      this.items[i].edit = false
    },
    confirmEditItem (id) {
      const i = this.findIndexById(id)
      if (i < 0) return
      this.items[i].name = this.items[i].model
      this.items[i].edit = false
    },
    setCurrentItem () {
      // this.currentItem = this.itmes[0].name
      // this.items.splice(0, 1)

      // shift() 移除陣列內的第一個東西 並回傳移除的內容
      // 如果是休息時間 -> 顯示休息一下
      this.currentItem = this.break ? '休息一下' : this.items.shift().name
    },
    countdown () {
      this.timeleft--
    },
    setFinishedItem () {
      // 如果現在不是休息時間
      if (!this.break) {
        // 把現在事項完成後 推入finishedItems 陣列
        this.finishedItems.push({
          name: this.currentItem,
          // 變成finishedItems只有名字有過來 要重給id
          id: this.id++
        })
      }
      this.currentItem = ''
      if (this.items.length > 0) {
        // toggle 休息時間 是 => 不是休息時間; 不是 => 是
        this.break = !this.break
      }
      this.timeleft = this.break ? timeBreak : time
    },
    delFinishedItem (id) {
      const i = this.finishedItems.findIndex(item => item.id === id)
      if (i < 0) return
      this.finishedItems.splice(i, 1)
    }
  },
  // pinia-plugin-persistedstate 的功能
  // 在localstorage保存資料
  persist: {
    // key = 在localstorage保存的名稱
    key: 'pomodoro-list'
  }
})
