// Browser-side playground that lets users upload and execute WebAssembly modules.
import { useMemo, useRef, useState } from 'react';

const LOG_LIMIT = 10;

const formatLog = (label, payload) => `${label}: ${payload}`;

// Parse a comma separated argument string into numeric values.
const parseArgs = (rawArgs) => {
  if (!rawArgs.trim()) {
    return [];
  }
  const parts = rawArgs.split(',').map((value) => value.trim()).filter(Boolean);
  return parts.map((value) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
      throw new Error(`数値に変換できません: ${value}`);
    }
    return parsed;
  });
};

const initialState = {
  exports: [],
  fileName: '',
};

// Render the WASM upload form and exported function runner.
export default function WasmPlayground() {
  const fileInputRef = useRef(null);
  const wasmInstanceRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [argsText, setArgsText] = useState('');
  const [selectedExport, setSelectedExport] = useState('');
  const [log, setLog] = useState([]);
  const [state, setState] = useState(initialState);

  const callableExports = useMemo(
    () => state.exports.filter((entry) => entry.kind === 'function'),
    [state.exports],
  );

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setLoading(true);
    setError('');
    setStatus('');
    setArgsText('');
    setSelectedExport('');
    setLog([]);

    try {
      const buffer = await file.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(buffer, {});

      const introspected = Object.entries(instance.exports).map(([name, value]) => ({
        name,
        kind: typeof value,
        arity: typeof value === 'function' ? value.length : undefined,
      }));

      wasmInstanceRef.current = instance;
      setState({
        exports: introspected,
        fileName: file.name,
      });

      const firstCallable = introspected.find((entry) => entry.kind === 'function');
      if (firstCallable) {
        setSelectedExport(firstCallable.name);
      }

      setStatus(`${file.name} を読み込みました`);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(message);
      wasmInstanceRef.current = null;
      setState(initialState);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const appendLog = (label, payload) => {
    setLog((prev) => {
      const next = [formatLog(label, payload), ...prev];
      return next.slice(0, LOG_LIMIT);
    });
  };

  const handleInvoke = () => {
    if (!wasmInstanceRef.current) {
      setError('WASMが読み込まれていません');
      return;
    }

    const target = wasmInstanceRef.current.exports[selectedExport];
    if (typeof target !== 'function') {
      setError('選択されたエクスポートは関数ではありません');
      return;
    }

    try {
      const args = parseArgs(argsText);
      if (args.length !== target.length) {
        throw new Error(`引数の数が一致しません (期待値: ${target.length})`);
      }
      const result = target(...args);
      appendLog(selectedExport, result);
      setStatus(`${selectedExport} を実行しました`);
      setError('');
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      setError(message);
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          WebAssembly ラボ
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          ユーザがアップロードした WebAssembly モジュールをブラウザ上で即座に実行できる簡易検証ページです。
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          長時間実行や無限ループのモジュールは UI を固める場合があります。必要に応じて別タブで開いてください。
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          サンプルとして{' '}
          <a
            href="/wasm/sample-add.wasm"
            download
            className="font-medium text-blue-600 underline transition hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200"
          >
            sample-add.wasm
          </a>{' '}
          を用意しています。
        </p>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center justify-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/30 transition hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-400">
              <span>{loading ? '読み込み中…' : 'WASMファイルを選択'}</span>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                data-testid="wasm-upload-input"
                accept=".wasm"
                onChange={handleFileSelect}
                disabled={loading}
              />
            </label>
            {state.fileName && (
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {state.fileName}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            {state.exports.length > 0
              ? '実行したい関数を選び、カンマ区切りで引数を指定して「実行」してください。引数は数値のみ対応しています。'
              : 'まずは `.wasm` ファイルをアップロードしてください。ページを離れると読み込み状態はクリアされます。'}
          </p>

          {callableExports.length > 0 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="wasm-export-select"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  エクスポート関数
                </label>
                <div className="relative">
                  <select
                    id="wasm-export-select"
                    value={selectedExport}
                    onChange={(event) => setSelectedExport(event.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/40"
                  >
                    {callableExports.map((entry) => (
                      <option
                        key={entry.name}
                        value={entry.name}
                        onClick={() => setSelectedExport(entry.name)}
                      >
                        {entry.name} (引数 {entry.arity ?? 0} 個)
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    ▾
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="wasm-args-input"
                  className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                >
                  引数（カンマ区切り）
                </label>
                <input
                  id="wasm-args-input"
                  type="text"
                  placeholder="例: 1, 2, 3"
                  value={argsText}
                  onChange={(event) => setArgsText(event.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:ring-blue-500/40"
                />
              </div>

              <button
                type="button"
                onClick={handleInvoke}
                disabled={!selectedExport}
                className="inline-flex items-center justify-center rounded-full border border-blue-400 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 disabled:hover:bg-transparent dark:border-blue-500/70 dark:text-blue-300 dark:hover:bg-blue-500/10 dark:focus-visible:ring-blue-500/40"
              >
                実行
              </button>
            </div>
          )}

          {state.exports.length > 0 && (
            <>
              <div className="h-px w-full bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  エクスポート一覧
                </h2>
                <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {state.exports.map((entry) => (
                    <li key={entry.name} className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                      <div className="font-medium">{entry.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {entry.kind === 'function'
                          ? `関数 / 引数 ${entry.arity ?? 0} 個`
                          : `型: ${entry.kind}`}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {log.length > 0 && (
            <>
              <div className="h-px w-full bg-slate-200 dark:bg-slate-700" />
              <div className="space-y-2">
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                  実行ログ（最新10件）
                </h2>
                <ul className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  {log.map((entry, index) => (
                    <li key={`${entry}-${index}`} className="break-all font-mono text-xs">
                      {entry}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </section>

      {status && (
        <div
          className="relative rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-md shadow-emerald-900/10 dark:border-emerald-500/40 dark:bg-emerald-900/40 dark:text-emerald-100"
          role="status"
          aria-live="assertive"
        >
          {status}
          <button
            type="button"
            onClick={() => setStatus('')}
            className="absolute right-3 top-3 rounded-full p-1 text-current transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/60"
            aria-label="通知を閉じる"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}

      {error && (
        <div
          className="relative rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 shadow-md shadow-rose-900/10 dark:border-rose-500/40 dark:bg-rose-900/40 dark:text-rose-100"
          role="alert"
          aria-live="assertive"
        >
          {error}
          <button
            type="button"
            onClick={() => setError('')}
            className="absolute right-3 top-3 rounded-full p-1 text-current transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current/60"
            aria-label="通知を閉じる"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
      )}
    </div>
  );
}
