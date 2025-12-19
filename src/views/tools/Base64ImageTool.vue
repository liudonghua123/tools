<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const activeTab = ref('encode')
const encodePreview = ref('')
const encodeBase64 = ref('')
const decodeInput = ref('')
const decodePreview = ref('')
const copied = ref(false)
const dragActive = ref(false)

const handleFileUpload = (e) => {
  const file = e.target.files?.[0]
  if (file) processFile(file)
}

const handleDrop = (e) => {
  dragActive.value = false
  const file = e.dataTransfer.files?.[0]
  if (file) processFile(file)
}

const processFile = (file) => {
  if (!file.type.startsWith('image/')) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    encodePreview.value = e.target.result
    encodeBase64.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handlePaste = (e) => {
  const items = e.clipboardData?.items
  if (!items) return
  
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile()
      processFile(blob)
      break
    }
  }
}

const processDecode = () => {
  if (!decodeInput.value) {
    decodePreview.value = ''
    return
  }
  
  let input = decodeInput.value.trim()
  // Add data url prefix if missing
  if (!input.startsWith('data:image/')) {
    // Try to guess mime type or default to png
    if (input.startsWith('/9j/')) input = 'data:image/jpeg;base64,' + input
    else if (input.startsWith('iVBORw0KGgo')) input = 'data:image/png;base64,' + input
    else if (input.startsWith('R0lGODlh')) input = 'data:image/gif;base64,' + input
    else if (input.startsWith('UklGR')) input = 'data:image/webp;base64,' + input
    else input = 'data:image/png;base64,' + input
  }
  
  decodePreview.value = input
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  }
}

const downloadImage = () => {
  if (!decodePreview.value) return
  const link = document.createElement('a')
  link.href = decodePreview.value
  link.download = `base64-image-${Date.now()}.png`
  link.click()
}

onMounted(() => {
  window.addEventListener('paste', handlePaste)
})

onUnmounted(() => {
  window.removeEventListener('paste', handlePaste)
})
</script>

<template>
  <div class="max-w-5xl mx-auto animate-fade-in px-4 sm:px-0 pt-4 pb-20">
    <div class="bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 overflow-hidden">
      <!-- Header -->
      <div class="p-8 sm:p-12 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10">
        <h2 class="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2">{{ t('tools.base64-image.title') }}</h2>
        <p class="mt-3 text-slate-500 font-medium text-lg">{{ t('tools.base64-image.desc') }}</p>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-slate-100 dark:border-slate-700">
        <button 
          v-for="tab in ['encode', 'decode']" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'flex-1 py-4 font-bold text-sm uppercase tracking-widest transition-all relative',
            activeTab === tab 
              ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50/30 dark:bg-emerald-900/10' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
          ]"
        >
          {{ t(`tools.base64-image.tabs.${tab}`) }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500"></div>
        </button>
      </div>

      <div class="p-8 sm:p-12">
        <!-- Encode View -->
        <div v-if="activeTab === 'encode'" class="space-y-8 animate-fade-in">
          <div 
            @dragover.prevent="dragActive = true"
            @dragleave.prevent="dragActive = false"
            @drop.prevent="handleDrop"
            :class="[
              'relative border-4 border-dashed rounded-[2rem] p-12 text-center transition-all group',
              dragActive 
                ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/20 scale-[0.98]' 
                : 'border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-600 bg-slate-50/50 dark:bg-slate-900/50'
            ]"
          >
            <input 
              type="file" 
              accept="image/*" 
              class="absolute inset-0 opacity-0 cursor-pointer" 
              @change="handleFileUpload"
            >
            <div class="space-y-4">
              <div class="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-lg font-bold text-slate-700 dark:text-slate-200">{{ t('tools.base64-image.encode.drop_zone') }}</p>
                <p class="text-slate-400 text-sm mt-1">{{ t('tools.base64-image.encode.paste_info') }}</p>
              </div>
            </div>
          </div>

          <div v-if="encodePreview" class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
            <div class="space-y-4">
              <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">{{ t('tools.base64-image.encode.preview') }}</h4>
              <div class="bg-slate-900 rounded-3xl p-4 flex items-center justify-center min-h-[200px] shadow-2xl overflow-hidden ring-1 ring-white/10">
                <img :src="encodePreview" class="max-w-full max-h-[300px] rounded-lg object-contain">
              </div>
              <button 
                @click="encodePreview = ''; encodeBase64 = ''"
                class="w-full py-3 text-red-500 font-bold text-sm transition-colors hover:text-red-400"
              >
                {{ t('tools.base64-image.encode.clear') }}
              </button>
            </div>
            <div class="space-y-4">
              <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">Base64 / Data URL</h4>
              <div class="relative group">
                <textarea 
                  readonly 
                  v-model="encodeBase64"
                  class="w-full h-[200px] bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs p-5 rounded-3xl outline-none shadow-inner resize-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                ></textarea>
                <div class="absolute bottom-4 right-4 flex gap-2">
                  <button 
                    @click="copyToClipboard(encodeBase64)"
                    :class="[
                      'px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 transform active:scale-95',
                      copied ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white/10 text-white hover:bg-white/20'
                    ]"
                  >
                    <svg v-if="copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ copied ? 'Copied!' : t('tools.base64-image.encode.copy_data_url') }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Decode View -->
        <div v-else class="space-y-8 animate-fade-in">
          <div class="space-y-4">
            <textarea 
              v-model="decodeInput"
              @input="processDecode"
              :placeholder="t('tools.base64-image.decode.placeholder')"
              class="w-full h-[150px] bg-slate-50/50 dark:bg-slate-900/50 border-2 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-emerald-400 font-mono text-xs p-6 rounded-[2rem] outline-none focus:border-emerald-500 transition-all shadow-inner"
            ></textarea>
            <div class="flex justify-end">
              <button 
                @click="decodeInput = ''; decodePreview = ''"
                class="px-4 py-2 text-slate-400 hover:text-red-500 font-bold text-xs transition-colors"
              >
                {{ t('tools.base64-image.decode.clear') }}
              </button>
            </div>
          </div>

          <div v-if="decodePreview" class="space-y-6 animate-slide-up">
            <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">{{ t('tools.base64-image.decode.preview') }}</h4>
            <div class="bg-slate-900 border border-slate-800 rounded-[2rem] p-8 flex items-center justify-center min-h-[300px] overflow-hidden group relative">
              <img :src="decodePreview" class="max-w-full max-h-[500px] shadow-2xl rounded-lg">
              
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  @click="downloadImage"
                  class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all flex items-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {{ t('tools.base64-image.decode.download') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 6s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
