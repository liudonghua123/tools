<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  getCodePoints,
  formatCodePoint,
  charToUtf8,
  charToUtf16,
  charToUtf32,
  formatBytes,
  formatBinary,
  analyzeUtf8Structure,
  analyzeSurrogatePair,
  getAsciiInfo,
  getAllEncodings,
  getGraphemes,
  parseHexString,
  utf8ToChar
} from './utils/encoding.js'

const { t } = useI18n()

const activeTab = ref('converter')
const tabs = ['converter', 'analyzer', 'ascii', 'knowledge']

// ========== Converter Tab ==========
const converterInput = ref('')
const copiedField = ref(null)

const encodingResults = computed(() => {
  if (!converterInput.value) return []
  const graphemes = getGraphemes(converterInput.value)
  return graphemes.map(char => getAllEncodings(char))
})

const copyToClipboard = async (text, field) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedField.value = field
    setTimeout(() => { copiedField.value = null }, 1500)
  } catch (e) {
    console.error('Copy failed', e)
  }
}

// Decoder
const decodeHexInput = ref('')
const decodeEncoding = ref('utf8')
const decodeResult = computed(() => {
  if (!decodeHexInput.value) return ''
  const bytes = parseHexString(decodeHexInput.value)
  if (bytes.length === 0) return '⚠️ Invalid hex'
  try {
    const decoder = new TextDecoder(decodeEncoding.value === 'utf16be' ? 'utf-16be' : 
                                     decodeEncoding.value === 'utf16le' ? 'utf-16le' : 'utf-8')
    return decoder.decode(new Uint8Array(bytes))
  } catch (e) {
    return '⚠️ Decode error'
  }
})

// ========== Analyzer Tab ==========
const analyzerInput = ref('中')
const utf8Analysis = computed(() => {
  if (!analyzerInput.value) return null
  const char = getGraphemes(analyzerInput.value)[0]
  return char ? analyzeUtf8Structure(char) : null
})
const surrogateAnalysis = computed(() => {
  if (!analyzerInput.value) return null
  const char = getGraphemes(analyzerInput.value)[0]
  return char ? analyzeSurrogatePair(char) : null
})

const utf8Rules = [
  { bytes: 1, range: 'U+0000 - U+007F', pattern: '0xxxxxxx', bits: 7 },
  { bytes: 2, range: 'U+0080 - U+07FF', pattern: '110xxxxx 10xxxxxx', bits: 11 },
  { bytes: 3, range: 'U+0800 - U+FFFF', pattern: '1110xxxx 10xxxxxx 10xxxxxx', bits: 16 },
  { bytes: 4, range: 'U+10000 - U+10FFFF', pattern: '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx', bits: 21 }
]

// ========== ASCII Tab ==========
const asciiFilter = ref('all')
const asciiData = computed(() => {
  const data = []
  for (let i = 0; i <= 127; i++) {
    const info = getAsciiInfo(i)
    if (asciiFilter.value === 'all' ||
        (asciiFilter.value === 'control' && info.isControl) ||
        (asciiFilter.value === 'printable' && info.isPrintable && !info.category.includes('Letter') && !info.category.includes('Digit')) ||
        (asciiFilter.value === 'letters' && info.category.includes('Letter')) ||
        (asciiFilter.value === 'digits' && info.category === 'Digit')) {
      data.push(info)
    }
  }
  return data
})

// ========== Knowledge Tab ==========
const activeTopic = ref('unicode')
const topics = ['unicode', 'utf8', 'utf16', 'gbk', 'history']
</script>

<template>
  <div class="max-w-6xl mx-auto animate-fade-in relative px-4 sm:px-0 pt-4">
    <!-- Header -->
    <div class="mb-8 text-center pt-8">
      <div class="inline-flex items-center justify-center p-4 bg-emerald-100/50 dark:bg-emerald-900/30 rounded-3xl mb-6 shadow-xl ring-4 ring-emerald-50 dark:ring-emerald-900/10">
        <svg class="w-10 h-10 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      </div>
      <h1 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{{ t('tools.char-encoding.title') }}</h1>
      <p class="mt-3 text-slate-500 font-medium text-lg">{{ t('tools.char-encoding.desc') }}</p>
    </div>

    <!-- Main Card -->
    <div class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/40 dark:border-gray-700/50">
      <!-- Tabs -->
      <div class="flex border-b border-gray-100 dark:border-gray-700 overflow-x-auto">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="activeTab = tab"
          :class="[
            'flex-1 min-w-[100px] py-5 text-center font-bold transition-all duration-300 relative whitespace-nowrap px-4',
            activeTab === tab 
              ? 'text-emerald-600 dark:text-emerald-400' 
              : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          ]"
        >
          {{ t(`tools.char-encoding.tabs.${tab}`) }}
          <div v-if="activeTab === tab" class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-4 animate-fade-in"></div>
        </button>
      </div>

      <div class="p-6 sm:p-10">
        <!-- ==================== CONVERTER TAB ==================== -->
        <div v-if="activeTab === 'converter'" class="space-y-8">
          <!-- Input -->
          <div class="space-y-4">
            <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest">
              {{ t('tools.char-encoding.converter.input_label') }}
            </label>
            <div class="relative group">
              <input 
                v-model="converterInput" 
                type="text" 
                :placeholder="t('tools.char-encoding.converter.input_placeholder')"
                class="block w-full px-6 py-5 text-3xl font-mono tracking-widest rounded-2xl border-2 border-slate-100 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/50 outline-none transition-all shadow-inner text-center"
              >
            </div>
          </div>

          <!-- Results -->
          <div v-if="encodingResults.length > 0" class="space-y-6">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {{ t('tools.char-encoding.converter.result_title') }}
            </h3>
            
            <div v-for="(result, idx) in encodingResults" :key="idx" class="bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
              <!-- Character Header -->
              <div class="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <span class="text-5xl">{{ result.char }}</span>
                <div>
                  <div class="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ result.unicode }}</div>
                  <div class="text-sm text-slate-400">Decimal: {{ result.decimal }}</div>
                </div>
              </div>

              <!-- Encoding Table -->
              <div class="overflow-x-auto">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="text-left text-slate-400 text-xs uppercase tracking-wider">
                      <th class="pb-3 font-bold">{{ t('tools.char-encoding.converter.encoding') }}</th>
                      <th class="pb-3 font-bold">{{ t('tools.char-encoding.converter.bytes') }}</th>
                      <th class="pb-3 font-bold">{{ t('tools.char-encoding.converter.hex') }}</th>
                      <th class="pb-3 font-bold w-16"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                    <!-- ASCII -->
                    <tr v-if="result.ascii !== null">
                      <td class="py-3 font-semibold text-slate-700 dark:text-slate-200">ASCII</td>
                      <td class="py-3 text-slate-500">1</td>
                      <td class="py-3 font-mono text-blue-600 dark:text-blue-400">{{ result.ascii.toString(16).toUpperCase().padStart(2, '0') }}</td>
                      <td class="py-3">
                        <button @click="copyToClipboard(result.ascii.toString(16).toUpperCase(), `ascii-${idx}`)" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <svg v-if="copiedField !== `ascii-${idx}`" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          <svg v-else class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </td>
                    </tr>
                    <tr v-else>
                      <td class="py-3 font-semibold text-slate-700 dark:text-slate-200">ASCII</td>
                      <td class="py-3 text-slate-400" colspan="3">{{ t('tools.char-encoding.converter.no_ascii') }}</td>
                    </tr>
                    <!-- UTF-8 -->
                    <tr>
                      <td class="py-3 font-semibold text-slate-700 dark:text-slate-200">UTF-8</td>
                      <td class="py-3 text-slate-500">{{ result.utf8.byteCount }}</td>
                      <td class="py-3 font-mono text-purple-600 dark:text-purple-400">{{ result.utf8.hex }}</td>
                      <td class="py-3">
                        <button @click="copyToClipboard(result.utf8.hex, `utf8-${idx}`)" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <svg v-if="copiedField !== `utf8-${idx}`" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          <svg v-else class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </td>
                    </tr>
                    <!-- UTF-16 BE -->
                    <tr>
                      <td class="py-3 font-semibold text-slate-700 dark:text-slate-200">UTF-16 BE</td>
                      <td class="py-3 text-slate-500">{{ result.utf16BE.bytes.length }}</td>
                      <td class="py-3 font-mono text-indigo-600 dark:text-indigo-400">{{ result.utf16BE.hex }}</td>
                      <td class="py-3">
                        <button @click="copyToClipboard(result.utf16BE.hex, `utf16be-${idx}`)" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <svg v-if="copiedField !== `utf16be-${idx}`" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          <svg v-else class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </td>
                    </tr>
                    <!-- UTF-16 LE -->
                    <tr>
                      <td class="py-3 font-semibold text-slate-700 dark:text-slate-200">UTF-16 LE</td>
                      <td class="py-3 text-slate-500">{{ result.utf16LE.bytes.length }}</td>
                      <td class="py-3 font-mono text-indigo-600 dark:text-indigo-400">{{ result.utf16LE.hex }}</td>
                      <td class="py-3">
                        <button @click="copyToClipboard(result.utf16LE.hex, `utf16le-${idx}`)" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <svg v-if="copiedField !== `utf16le-${idx}`" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          <svg v-else class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </td>
                    </tr>
                    <!-- UTF-32 BE -->
                    <tr>
                      <td class="py-3 font-semibold text-slate-700 dark:text-slate-200">UTF-32 BE</td>
                      <td class="py-3 text-slate-500">4</td>
                      <td class="py-3 font-mono text-pink-600 dark:text-pink-400">{{ result.utf32BE.hex }}</td>
                      <td class="py-3">
                        <button @click="copyToClipboard(result.utf32BE.hex, `utf32be-${idx}`)" class="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                          <svg v-if="copiedField !== `utf32be-${idx}`" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                          <svg v-else class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Decoder Section -->
          <div class="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {{ t('tools.char-encoding.converter.decode_title') }}
            </h3>
            <div class="flex flex-col sm:flex-row gap-4">
              <input 
                v-model="decodeHexInput" 
                type="text" 
                :placeholder="t('tools.char-encoding.converter.decode_placeholder')"
                class="flex-1 px-4 py-3 font-mono rounded-xl border-2 border-slate-100 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/50 outline-none transition-all"
              >
              <select 
                v-model="decodeEncoding"
                class="px-4 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 outline-none font-medium"
              >
                <option value="utf8">UTF-8</option>
                <option value="utf16be">UTF-16 BE</option>
                <option value="utf16le">UTF-16 LE</option>
              </select>
            </div>
            <div v-if="decodeHexInput" class="p-4 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
              <span class="text-sm text-slate-400 mr-2">{{ t('tools.char-encoding.converter.decoded_result') }}:</span>
              <span class="text-2xl font-bold">{{ decodeResult }}</span>
            </div>
          </div>
        </div>

        <!-- ==================== ANALYZER TAB ==================== -->
        <div v-else-if="activeTab === 'analyzer'" class="space-y-10">
          <!-- Input -->
          <div class="space-y-4">
            <label class="block text-sm font-bold text-gray-400 uppercase tracking-widest">
              {{ t('tools.char-encoding.analyzer.title') }}
            </label>
            <input 
              v-model="analyzerInput" 
              type="text" 
              maxlength="2"
              :placeholder="t('tools.char-encoding.analyzer.input_placeholder')"
              class="block w-full px-6 py-5 text-4xl font-mono tracking-widest rounded-2xl border-2 border-slate-100 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 bg-slate-50/50 dark:bg-slate-900/50 outline-none transition-all shadow-inner text-center"
            >
          </div>

          <!-- UTF-8 Structure Analysis -->
          <div v-if="utf8Analysis" class="space-y-6">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>
              {{ t('tools.char-encoding.analyzer.byte_structure') }}
            </h3>

            <!-- Character Info -->
            <div class="flex items-center gap-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/50">
              <span class="text-6xl">{{ utf8Analysis.char }}</span>
              <div class="space-y-1">
                <div class="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400">{{ utf8Analysis.codePointHex }}</div>
                <div class="text-slate-500">{{ utf8Analysis.byteCount }} {{ t('tools.char-encoding.analyzer.bytes_count') }} UTF-8</div>
              </div>
            </div>

            <!-- Byte Boxes -->
            <div class="flex flex-wrap gap-4 justify-center">
              <div v-for="(byte, i) in utf8Analysis.bytes" :key="i" class="flex-shrink-0">
                <div class="w-28 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg">
                  <div class="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-center py-2 font-bold text-sm">
                    Byte {{ i + 1 }}
                  </div>
                  <div class="p-3 space-y-2 text-center">
                    <div class="font-mono text-xs text-slate-400 break-all">{{ utf8Analysis.bytesBinary[i] }}</div>
                    <div class="font-mono text-2xl font-bold text-indigo-600 dark:text-indigo-400">{{ byte.toString(16).toUpperCase().padStart(2, '0') }}</div>
                    <div class="text-xs text-slate-400">{{ byte }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pattern -->
            <div class="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div class="text-sm text-slate-400 mb-2">{{ t('tools.char-encoding.analyzer.pattern') }}</div>
              <div class="font-mono text-lg tracking-wider">
                <span v-for="(part, i) in utf8Analysis.pattern.split(' ')" :key="i" class="inline-block mr-2">
                  <span v-for="(ch, j) in part" :key="j" :class="ch === 'x' ? 'text-emerald-500 font-bold' : 'text-slate-400'">{{ ch }}</span>
                </span>
              </div>
            </div>

            <!-- Data Bits -->
            <div class="p-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div class="text-sm text-slate-400 mb-2">{{ t('tools.char-encoding.analyzer.data_bits') }}</div>
              <div class="font-mono text-lg text-emerald-600 dark:text-emerald-400 tracking-widest">{{ utf8Analysis.dataBits }}</div>
              <div class="text-sm text-slate-400 mt-2">
                {{ t('tools.char-encoding.analyzer.combined') }}: 
                <span class="font-mono text-slate-600 dark:text-slate-300">0x{{ utf8Analysis.codePoint.toString(16).toUpperCase() }} = {{ utf8Analysis.codePoint }}</span>
              </div>
            </div>

            <!-- Range Info -->
            <div v-if="utf8Analysis.range" class="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <div class="text-sm text-blue-600 dark:text-blue-400 font-bold">{{ t('tools.char-encoding.analyzer.range_info') }}</div>
              <div class="text-slate-600 dark:text-slate-300 mt-1">
                {{ utf8Analysis.range.description }} (U+{{ utf8Analysis.range.start.toString(16).toUpperCase() }} - U+{{ utf8Analysis.range.end.toString(16).toUpperCase() }})
              </div>
            </div>
          </div>

          <!-- UTF-16 Surrogate Pair Analysis -->
          <div v-if="surrogateAnalysis" class="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-700">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              {{ t('tools.char-encoding.analyzer.surrogate_title') }}
            </h3>

            <div v-if="surrogateAnalysis.needsSurrogate" class="space-y-4">
              <div class="p-4 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
                <span class="text-amber-600 dark:text-amber-400 font-bold">⚡ {{ t('tools.char-encoding.analyzer.needs_surrogate') }}</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">{{ t('tools.char-encoding.analyzer.original_codepoint') }}</div>
                  <div class="font-mono text-xl font-bold text-slate-700 dark:text-slate-200">{{ surrogateAnalysis.codePointHex }}</div>
                </div>
                <div class="p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div class="text-xs text-slate-400 uppercase tracking-wider mb-1">{{ t('tools.char-encoding.analyzer.adjusted_value') }}</div>
                  <div class="font-mono text-xl font-bold text-slate-700 dark:text-slate-200">0x{{ surrogateAnalysis.adjusted }}</div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <div class="flex-1 p-5 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200/50 dark:border-rose-800/50 text-center">
                  <div class="text-xs text-rose-500 dark:text-rose-400 uppercase tracking-wider mb-2">{{ t('tools.char-encoding.analyzer.high_surrogate') }}</div>
                  <div class="font-mono text-2xl font-bold text-rose-600 dark:text-rose-400">0x{{ surrogateAnalysis.highSurrogateHex }}</div>
                  <div class="text-sm text-slate-400 mt-1">(D800 + {{ surrogateAnalysis.highBits }})</div>
                </div>
                <div class="flex items-center justify-center">
                  <svg class="w-6 h-6 text-slate-300 rotate-90 sm:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m0 0l-4-4m4 4l4-4" /></svg>
                </div>
                <div class="flex-1 p-5 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200/50 dark:border-violet-800/50 text-center">
                  <div class="text-xs text-violet-500 dark:text-violet-400 uppercase tracking-wider mb-2">{{ t('tools.char-encoding.analyzer.low_surrogate') }}</div>
                  <div class="font-mono text-2xl font-bold text-violet-600 dark:text-violet-400">0x{{ surrogateAnalysis.lowSurrogateHex }}</div>
                  <div class="text-sm text-slate-400 mt-1">(DC00 + {{ surrogateAnalysis.lowBits }})</div>
                </div>
              </div>
            </div>

            <div v-else class="p-4 bg-green-50/50 dark:bg-green-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
              <span class="text-green-600 dark:text-green-400 font-bold">✓ {{ t('tools.char-encoding.analyzer.no_surrogate') }}</span>
              <div class="mt-2 text-sm text-slate-500">UTF-16 BE: <span class="font-mono">{{ surrogateAnalysis.utf16BE }}</span></div>
            </div>
          </div>

          <!-- UTF-8 Rules Reference -->
          <div class="pt-8 border-t border-slate-100 dark:border-slate-700 space-y-4">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-widest">
              {{ t('tools.char-encoding.analyzer.utf8_rules_title') }}
            </h3>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="text-left text-slate-400 text-xs uppercase tracking-wider">
                    <th class="pb-3 font-bold">{{ t('tools.char-encoding.analyzer.bytes_count') }}</th>
                    <th class="pb-3 font-bold">{{ t('tools.char-encoding.analyzer.codepoint_range') }}</th>
                    <th class="pb-3 font-bold">{{ t('tools.char-encoding.analyzer.byte_pattern') }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                  <tr v-for="rule in utf8Rules" :key="rule.bytes" :class="utf8Analysis?.byteCount === rule.bytes ? 'bg-emerald-50/50 dark:bg-emerald-900/20' : ''">
                    <td class="py-3 font-bold" :class="utf8Analysis?.byteCount === rule.bytes ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-200'">{{ rule.bytes }}</td>
                    <td class="py-3 font-mono text-slate-500">{{ rule.range }}</td>
                    <td class="py-3 font-mono text-xs text-slate-400">{{ rule.pattern }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ==================== ASCII TAB ==================== -->
        <div v-else-if="activeTab === 'ascii'" class="space-y-6">
          <div class="flex flex-wrap gap-2 mb-6">
            <button 
              v-for="filter in ['all', 'control', 'letters', 'digits', 'printable']" 
              :key="filter"
              @click="asciiFilter = filter"
              :class="[
                'px-4 py-2 rounded-xl font-medium text-sm transition-all',
                asciiFilter === filter 
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              ]"
            >
              {{ t(`tools.char-encoding.ascii.filter_${filter}`) }}
            </button>
          </div>

          <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table class="w-full text-sm">
              <thead class="bg-slate-50 dark:bg-slate-800">
                <tr class="text-left text-slate-400 text-xs uppercase tracking-wider">
                  <th class="p-3 font-bold">{{ t('tools.char-encoding.ascii.dec') }}</th>
                  <th class="p-3 font-bold">{{ t('tools.char-encoding.ascii.hex') }}</th>
                  <th class="p-3 font-bold">{{ t('tools.char-encoding.ascii.char') }}</th>
                  <th class="p-3 font-bold">{{ t('tools.char-encoding.ascii.description') }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                <tr 
                  v-for="item in asciiData" 
                  :key="item.code"
                  class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td class="p-3 font-mono text-slate-600 dark:text-slate-300">{{ item.code }}</td>
                  <td class="p-3 font-mono text-emerald-600 dark:text-emerald-400">0x{{ item.hex }}</td>
                  <td class="p-3 text-xl">
                    <span v-if="item.isPrintable" class="font-mono">{{ item.char }}</span>
                    <span v-else class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">{{ item.description.split(' ')[0] }}</span>
                  </td>
                  <td class="p-3 text-slate-500">
                    <span :class="[
                      'inline-block px-2 py-0.5 rounded text-xs font-medium mr-2',
                      item.isControl ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      item.category.includes('Letter') ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                      item.category === 'Digit' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                      'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                    ]">{{ item.category }}</span>
                    {{ item.description }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ==================== KNOWLEDGE TAB ==================== -->
        <div v-else-if="activeTab === 'knowledge'" class="space-y-8">
          <!-- Topic Tabs -->
          <div class="flex flex-wrap gap-2">
            <button 
              v-for="topic in topics" 
              :key="topic"
              @click="activeTopic = topic"
              :class="[
                'px-5 py-2.5 rounded-xl font-medium transition-all',
                activeTopic === topic 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg' 
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              ]"
            >
              {{ t(`tools.char-encoding.knowledge.topics.${topic}`) }}
            </button>
          </div>

          <!-- Unicode Content -->
          <div v-if="activeTopic === 'unicode'" class="space-y-6">
            <div class="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50">
              <h3 class="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">{{ t('tools.char-encoding.knowledge.unicode.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.unicode.intro') }}</p>
            </div>

            <div class="grid gap-4">
              <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">{{ t('tools.char-encoding.knowledge.unicode.codepoint_title') }}</h4>
                <p class="text-slate-500">{{ t('tools.char-encoding.knowledge.unicode.codepoint_desc') }}</p>
              </div>
              
              <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-3">{{ t('tools.char-encoding.knowledge.unicode.planes_title') }}</h4>
                <ul class="space-y-2 text-slate-500">
                  <li class="flex items-start gap-2">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    {{ t('tools.char-encoding.knowledge.unicode.plane0') }}
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    {{ t('tools.char-encoding.knowledge.unicode.plane1') }}
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></span>
                    {{ t('tools.char-encoding.knowledge.unicode.plane2') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- UTF-8 Content -->
          <div v-else-if="activeTopic === 'utf8'" class="space-y-6">
            <div class="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-800/50">
              <h3 class="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">{{ t('tools.char-encoding.knowledge.utf8.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.utf8.intro') }}</p>
            </div>

            <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-3">{{ t('tools.char-encoding.knowledge.utf8.rules_title') }}</h4>
              <ul class="space-y-2 font-mono text-sm">
                <li class="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.utf8.rule1') }}</li>
                <li class="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.utf8.rule2') }}</li>
                <li class="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.utf8.rule3') }}</li>
                <li class="p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.utf8.rule4') }}</li>
              </ul>
            </div>

            <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-3">{{ t('tools.char-encoding.knowledge.utf8.advantages_title') }}</h4>
              <ul class="space-y-2 text-slate-500">
                <li class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  {{ t('tools.char-encoding.knowledge.utf8.adv1') }}
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  {{ t('tools.char-encoding.knowledge.utf8.adv2') }}
                </li>
                <li class="flex items-start gap-2">
                  <svg class="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  {{ t('tools.char-encoding.knowledge.utf8.adv3') }}
                </li>
              </ul>
            </div>
          </div>

          <!-- UTF-16/32 Content -->
          <div v-else-if="activeTopic === 'utf16'" class="space-y-6">
            <div class="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200/50 dark:border-indigo-800/50">
              <h3 class="text-xl font-bold text-indigo-700 dark:text-indigo-300 mb-3">{{ t('tools.char-encoding.knowledge.utf16.title') }}</h3>
              <p class="text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.utf16.utf16_intro') }}</p>
            </div>

            <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-3">{{ t('tools.char-encoding.knowledge.utf16.surrogate_title') }}</h4>
              <p class="text-slate-500 mb-3">{{ t('tools.char-encoding.knowledge.utf16.surrogate_desc') }}</p>
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
                  <span class="font-mono text-rose-600 dark:text-rose-400">{{ t('tools.char-encoding.knowledge.utf16.high_range') }}</span>
                </div>
                <div class="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-lg">
                  <span class="font-mono text-violet-600 dark:text-violet-400">{{ t('tools.char-encoding.knowledge.utf16.low_range') }}</span>
                </div>
              </div>
            </div>

            <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
              <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-3">{{ t('tools.char-encoding.knowledge.utf16.endian_title') }}</h4>
              <ul class="space-y-2 text-slate-500">
                <li><strong>BE:</strong> {{ t('tools.char-encoding.knowledge.utf16.be_desc') }}</li>
                <li><strong>LE:</strong> {{ t('tools.char-encoding.knowledge.utf16.le_desc') }}</li>
              </ul>
            </div>

            <div class="p-5 bg-amber-50/50 dark:bg-amber-900/20 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
              <h4 class="font-bold text-amber-700 dark:text-amber-300 mb-2">{{ t('tools.char-encoding.knowledge.utf16.bom_title') }}</h4>
              <p class="text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.utf16.bom_desc') }}</p>
            </div>
          </div>

          <!-- GBK Content -->
          <div v-else-if="activeTopic === 'gbk'" class="space-y-6">
            <div class="p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl border border-red-200/50 dark:border-red-800/50">
              <h3 class="text-xl font-bold text-red-700 dark:text-red-300 mb-3">{{ t('tools.char-encoding.knowledge.gbk.title') }}</h3>
            </div>

            <div class="grid gap-4">
              <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">{{ t('tools.char-encoding.knowledge.gbk.gb2312_title') }}</h4>
                <p class="text-slate-500">{{ t('tools.char-encoding.knowledge.gbk.gb2312_desc') }}</p>
              </div>
              <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">{{ t('tools.char-encoding.knowledge.gbk.gbk_title') }}</h4>
                <p class="text-slate-500">{{ t('tools.char-encoding.knowledge.gbk.gbk_desc') }}</p>
              </div>
              <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">{{ t('tools.char-encoding.knowledge.gbk.gb18030_title') }}</h4>
                <p class="text-slate-500">{{ t('tools.char-encoding.knowledge.gbk.gb18030_desc') }}</p>
              </div>
              <div class="p-5 bg-emerald-50/50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/50">
                <h4 class="font-bold text-emerald-700 dark:text-emerald-300 mb-2">{{ t('tools.char-encoding.knowledge.gbk.structure_title') }}</h4>
                <p class="text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.gbk.structure_desc') }}</p>
              </div>
            </div>
          </div>

          <!-- History Content -->
          <div v-else-if="activeTopic === 'history'" class="space-y-6">
            <div class="p-6 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-slate-200 dark:border-slate-600">
              <h3 class="text-xl font-bold text-slate-700 dark:text-slate-200 mb-3">{{ t('tools.char-encoding.knowledge.history.title') }}</h3>
            </div>

            <div class="relative pl-8 border-l-2 border-emerald-300 dark:border-emerald-700 space-y-8">
              <div class="relative">
                <div class="absolute -left-[25px] w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900"></div>
                <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">{{ t('tools.char-encoding.knowledge.history.ascii_era') }}</h4>
                  <p class="text-slate-500">{{ t('tools.char-encoding.knowledge.history.ascii_desc') }}</p>
                </div>
              </div>
              <div class="relative">
                <div class="absolute -left-[25px] w-4 h-4 bg-amber-500 rounded-full border-4 border-white dark:border-slate-900"></div>
                <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">{{ t('tools.char-encoding.knowledge.history.chaos_era') }}</h4>
                  <p class="text-slate-500">{{ t('tools.char-encoding.knowledge.history.chaos_desc') }}</p>
                </div>
              </div>
              <div class="relative">
                <div class="absolute -left-[25px] w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-900"></div>
                <div class="p-5 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 class="font-bold text-slate-700 dark:text-slate-200 mb-2">{{ t('tools.char-encoding.knowledge.history.unicode_era') }}</h4>
                  <p class="text-slate-500">{{ t('tools.char-encoding.knowledge.history.unicode_desc') }}</p>
                </div>
              </div>
              <div class="relative">
                <div class="absolute -left-[25px] w-4 h-4 bg-green-500 rounded-full border-4 border-white dark:border-slate-900"></div>
                <div class="p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-800/50">
                  <h4 class="font-bold text-green-700 dark:text-green-300 mb-2">{{ t('tools.char-encoding.knowledge.history.today') }}</h4>
                  <p class="text-slate-600 dark:text-slate-300">{{ t('tools.char-encoding.knowledge.history.today_desc') }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth transitions for tab content */
</style>
