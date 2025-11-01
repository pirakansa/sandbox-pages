import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import WasmPlayground from '../WasmPlayground.jsx';

describe('WasmPlayground', () => {
  let instantiateSpy;
  let user;
  let addMock;

  beforeEach(() => {
    user = userEvent.setup();

    const noop = vi.fn(() => 0);
    addMock = vi.fn((a, b) => a + b);
    function add(a, b) {
      return addMock(a, b);
    }

    const instance = {
      exports: {
        noop,
        add,
      },
    };

    instantiateSpy = vi.spyOn(WebAssembly, 'instantiate').mockImplementation(async (buffer) => {
      expect(buffer).toBeInstanceOf(ArrayBuffer);
      return { instance, module: {} };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('アップロードしたWASMのエクスポートを表示し関数を実行できる', async () => {
    render(<WasmPlayground />);

    const fileInput = screen.getByTestId('wasm-upload-input');
    const wasmFile = new File([new Uint8Array([0x00])], 'sample.wasm', { type: 'application/wasm' });
    wasmFile.arrayBuffer = vi.fn(async () => new ArrayBuffer(8));

    Object.defineProperty(fileInput, 'files', {
      value: [wasmFile],
      configurable: true,
    });
    fireEvent.change(fileInput);

    await waitFor(() => expect(instantiateSpy).toHaveBeenCalled());

    expect(await screen.findByText('エクスポート一覧')).toBeInTheDocument();

    const combobox = screen.getByRole('combobox', { name: 'エクスポート関数' });
    expect(combobox).toHaveTextContent('noop');

    await user.click(combobox);
    await user.click(await screen.findByRole('option', { name: /add/ }));

    const argsField = screen.getByLabelText('引数（カンマ区切り）');
    await user.type(argsField, '1, 2');

    await user.click(screen.getByRole('button', { name: '実行' }));

    expect(await screen.findByText('add: 3')).toBeInTheDocument();
    expect(screen.getByText('add を実行しました')).toBeInTheDocument();
    expect(addMock).toHaveBeenCalledWith(1, 2);
  });
});
