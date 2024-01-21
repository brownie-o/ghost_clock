// Utilities
import { createPinia } from 'pinia'
// 設定儲存localstorage
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia
