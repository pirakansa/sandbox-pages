// Browser-side playground that lets users upload and execute WebAssembly modules.
import { useMemo, useRef, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

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
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" gutterBottom>
          WebAssembly ラボ
        </Typography>
        <Typography variant="body1">
          ユーザがアップロードした WebAssembly モジュールをブラウザ上で即座に実行できる簡易検証ページです。
        </Typography>
        <Typography variant="body2" color="text.secondary">
          長時間実行や無限ループのモジュールは UI を固める場合があります。必要に応じて別タブで開いてください。
        </Typography>
        <Typography variant="body2" color="text.secondary">
          サンプルとして <Link href="/wasm/sample-add.wasm" download>sample-add.wasm</Link> を用意しています。
        </Typography>
      </Box>

      <Paper variant="outlined">
        <Box p={3}>
          <Stack spacing={2}>
            <div>
              <Button
                variant="contained"
                component="label"
                disabled={loading}
              >
                WASMファイルを選択
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  data-testid="wasm-upload-input"
                  accept=".wasm"
                  onChange={handleFileSelect}
                />
              </Button>
              {state.fileName && (
                <Typography component="span" sx={{ ml: 2 }}>
                  {state.fileName}
                </Typography>
              )}
            </div>

            {state.exports.length > 0 ? (
              <Typography variant="body2" color="text.secondary">
                実行したい関数を選び、カンマ区切りで引数を指定して「実行」してください。引数は数値のみ対応しています。
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                まずは `.wasm` ファイルをアップロードしてください。ページを離れると読み込み状態はクリアされます。
              </Typography>
            )}

            {callableExports.length > 0 && (
              <Stack spacing={2}>
                <FormControl size="small">
                  <InputLabel id="wasm-export-label">エクスポート関数</InputLabel>
                  <Select
                    labelId="wasm-export-label"
                    label="エクスポート関数"
                    value={selectedExport}
                    onChange={(event) => setSelectedExport(event.target.value)}
                  >
                    {callableExports.map((entry) => (
                      <MenuItem key={entry.name} value={entry.name}>
                        {entry.name} (引数 {entry.arity ?? 0} 個)
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  label="引数（カンマ区切り）"
                  placeholder="例: 1, 2, 3"
                  value={argsText}
                  onChange={(event) => setArgsText(event.target.value)}
                />

                <Button
                  variant="outlined"
                  onClick={handleInvoke}
                  disabled={!selectedExport}
                >
                  実行
                </Button>
              </Stack>
            )}

            {state.exports.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle1">エクスポート一覧</Typography>
                  <List dense>
                    {state.exports.map((entry) => (
                      <ListItem key={entry.name}>
                        <ListItemText
                          primary={entry.name}
                          secondary={entry.kind === 'function'
                            ? `関数 / 引数 ${entry.arity ?? 0} 個`
                            : `型: ${entry.kind}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}

            {log.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle1">実行ログ（最新10件）</Typography>
                  <List dense>
                    {log.map((entry, index) => (
                      <ListItem key={`${entry}-${index}`}>
                        <ListItemText primary={entry} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </>
            )}
          </Stack>
        </Box>
      </Paper>

      {status && (
        <Alert severity="success" onClose={() => setStatus('')}>
          {status}
        </Alert>
      )}

      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
    </Stack>
  );
}
