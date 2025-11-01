import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { vi, describe, it, beforeEach, afterEach, beforeAll, afterAll, expect } from 'vitest';

const { jsQRMock } = vi.hoisted(() => ({
  jsQRMock: vi.fn(),
}));

vi.mock('jsqr', () => ({
  default: jsQRMock,
}));

import Cameraviewer from '../Cameraviewer.jsx';

let originalNavigator;
let originalExecCommand;
let navigatorOverride;

describe('Cameraviewer', () => {
  let getUserMediaMock;
  let trackStopMock;
  let getTracksMock;
  let mockStream;
  let user;

  beforeAll(() => {
    originalNavigator = globalThis.navigator;
    originalExecCommand = document.execCommand;
  });

  const setupNavigator = () => {
    navigatorOverride = Object.create(originalNavigator || {});
    navigatorOverride.mediaDevices = {
      getUserMedia: getUserMediaMock,
    };
    navigatorOverride.clipboard = {
      writeText: vi.fn(() => Promise.resolve()),
    };

    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: navigatorOverride,
    });
  };

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    jsQRMock.mockReset();

    trackStopMock = vi.fn();
    getTracksMock = vi.fn(() => [{ stop: trackStopMock }]);
    mockStream = { getTracks: getTracksMock };

    getUserMediaMock = vi.fn(() => Promise.resolve(mockStream));
    setupNavigator();

    vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      drawImage: vi.fn(),
      getImageData: vi.fn(() => ({
        data: new Uint8ClampedArray(4),
        width: 2,
        height: 2,
      })),
    });

    if (!originalExecCommand) {
      document.execCommand = vi.fn();
    } else {
      vi.spyOn(document, 'execCommand').mockImplementation(() => true);
    }

    user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  });

  afterEach(() => {
    cleanup();
    vi.runOnlyPendingTimers();
    vi.restoreAllMocks();
    vi.useRealTimers();

    if (originalExecCommand) {
      document.execCommand = originalExecCommand;
    } else {
      delete document.execCommand;
    }

    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: originalNavigator,
    });
  });

  afterAll(() => {
    if (originalExecCommand) {
      document.execCommand = originalExecCommand;
    } else {
      delete document.execCommand;
    }

    Object.defineProperty(globalThis, 'navigator', {
      configurable: true,
      value: originalNavigator,
    });
  });

  const triggerCameraReady = async () => {
    await waitFor(() => {
      const videoEl = document.querySelector('#js-video');
      expect(videoEl).not.toBeNull();
      expect(typeof videoEl.onloadedmetadata).toBe('function');
    });
    const video = document.querySelector('#js-video');
    await act(async () => {
      video.onloadedmetadata();
    });
    return video;
  };

  it('環境カメラでQRコード内容を表示する', async () => {
    render(<Cameraviewer />);

    await waitFor(() => {
      expect(getUserMediaMock).toHaveBeenCalledWith({
        video: { facingMode: { exact: 'environment' } },
        audio: false,
      });
    });

    await triggerCameraReady();

    jsQRMock.mockReturnValue({ data: 'https://example.jp' });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(await screen.findByText('https://example.jp')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('環境カメラ取得に失敗した場合は汎用カメラへフォールバックする', async () => {
    const fallbackStream = { getTracks: vi.fn(() => [{ stop: vi.fn() }]) };
    getUserMediaMock
      .mockRejectedValueOnce(new Error('no env camera'))
      .mockResolvedValueOnce(fallbackStream);

    render(<Cameraviewer />);

    await waitFor(() => {
      expect(getUserMediaMock).toHaveBeenNthCalledWith(1, {
        video: { facingMode: { exact: 'environment' } },
        audio: false,
      });
      expect(getUserMediaMock).toHaveBeenNthCalledWith(2, {
        video: true,
        audio: false,
      });
    });
  });

  it('アンマウント時にカメラリソースを解放する', async () => {
    const { unmount } = render(<Cameraviewer />);

    await waitFor(() => expect(getUserMediaMock).toHaveBeenCalled());

    const video = await triggerCameraReady();

    await act(async () => {
      unmount();
    });

    expect(getTracksMock).toHaveBeenCalledTimes(2);
    expect(trackStopMock).toHaveBeenCalledTimes(2);
    expect(video.srcObject).toBeNull();
  });

  it('停止ボタンでストリームを止め履歴に戻る', async () => {
    const backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});

    render(<Cameraviewer />);

    await waitFor(() => expect(getUserMediaMock).toHaveBeenCalled());

    const video = await triggerCameraReady();

    await act(async () => {
      video.dispatchEvent(new Event('playing'));
    });

    const stopButton = document.querySelector('button');
    await user.click(stopButton);

    await act(async () => {
      vi.advanceTimersByTime(300);
    });

    expect(getTracksMock).toHaveBeenCalledTimes(2);
    expect(trackStopMock).toHaveBeenCalledTimes(2);
    expect(video.srcObject).toBeNull();
    expect(backSpy).toHaveBeenCalled();
  });
});
