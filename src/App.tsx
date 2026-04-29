import { useState } from 'react'

interface DeepLinkConfig {
  scheme: 'veridian' | 'https'
  path: string
  params: { key: string; value: string }[]
}

const PATHS = [
  { value: 'ssi-setup', label: 'SSI Setup' },
  { value: 'ssi-auth', label: 'SSI Auth' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'connect', label: 'Connect' },
]

const SCHEMES = [
  { value: 'veridian', label: 'veridian://' },
  { value: 'https', label: 'https://veridian.id/' },
]

function App() {
  const [config, setConfig] = useState<DeepLinkConfig>({
    scheme: 'veridian',
    path: 'ssi-setup',
    params: [
      { key: 'bootUrl', value: '' },
      { key: 'connectUrl', value: '' },
    ],
  })
  const [copied, setCopied] = useState(false)
  const [pasted, setPasted] = useState<number | null>(null)

  const buildUrl = () => {
    const base = SCHEMES.find((s) => s.value === config.scheme)?.label || ''
    const path = config.path
    const queryString = config.params
      .filter((p) => p.key && p.value)
      .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(p.value)}`)
      .join('&')

    return `${base}${path}${queryString ? '?' + queryString : ''}`
  }

  const addParam = () => {
    setConfig({ ...config, params: [...config.params, { key: '', value: '' }] })
  }

  const removeParam = (index: number) => {
    setConfig({
      ...config,
      params: config.params.filter((_, i) => i !== index),
    })
  }

  const updateParam = (index: number, field: 'key' | 'value', value: string) => {
    const newParams = [...config.params]
    newParams[index][field] = value
    setConfig({ ...config, params: newParams })
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(buildUrl())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const pasteValue = async (index: number) => {
    const text = await navigator.clipboard.readText()
    updateParam(index, 'value', text)
    setPasted(index)
    setTimeout(() => setPasted(null), 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-6 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-2">
          Veridian DeepLink Configurator
        </h1>
        <p className="text-slate-400 text-center mb-6 sm:mb-8 text-sm sm:text-base">
          Build your deep linking URLs
        </p>

        <div className="bg-slate-800 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
          <div className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Scheme
              </label>
              <div className="flex gap-2 sm:gap-3 flex-wrap">
                {SCHEMES.map((scheme) => (
                  <button
                    key={scheme.value}
                    onClick={() => setConfig({ ...config, scheme: scheme.value as 'veridian' | 'https' })}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      config.scheme === scheme.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {scheme.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Path
              </label>
              <input
                type="text"
                value={config.path}
                onChange={(e) => setConfig({ ...config, path: e.target.value })}
                placeholder="e.g. ssi-setup, wallet, custom/path"
                list="paths"
                className="w-full bg-slate-700 text-white rounded-lg px-3 sm:px-4 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
              />
              <datalist id="paths">
                {PATHS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">
                  Parameters
                </label>
                <button
                  onClick={addParam}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  + Add param
                </button>
              </div>
              <div className="space-y-2">
                {config.params.map((param, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="key"
                      value={param.key}
                      onChange={(e) => updateParam(index, 'key', e.target.value)}
                      className="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none text-sm min-w-0"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="value"
                        value={param.value}
                        onChange={(e) => updateParam(index, 'value', e.target.value)}
                        className="flex-[2] bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-blue-500 focus:outline-none text-sm min-w-0"
                      />
                      <button
                        onClick={() => pasteValue(index)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          pasted === index
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                        }`}
                        title="Paste from clipboard"
                      >
                        {pasted === index ? '✓' : 'Paste'}
                      </button>
                      {config.params.length > 1 && (
                        <button
                          onClick={() => removeParam(index)}
                          className="text-slate-400 hover:text-red-400 px-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-700 pt-4 sm:pt-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Generated URL
              </label>
              <div className="bg-slate-900 rounded-lg p-3 sm:p-4 overflow-x-auto">
                <code className="text-green-400 text-xs sm:text-sm font-mono whitespace-nowrap">
                  {buildUrl()}
                </code>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={copyToClipboard}
                  className={`flex-1 py-2 rounded-lg font-medium transition-colors text-sm ${
                    copied
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-500'
                  }`}
                >
                  {copied ? '✓ Copied!' : 'Copy to Clipboard'}
                </button>
                <a
                  href={buildUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg font-medium transition-colors text-sm bg-emerald-600 text-white hover:bg-emerald-500 text-center"
                >
                  Open DeepLink
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App