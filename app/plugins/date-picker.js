
import { DatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('DatePicker', DatePicker)
})
