import { renderHook, act } from "@testing-library/react-hooks";
import useObserver from "./useObserver";

describe("useObserver", () => {
  let mockLoadMore: jest.Mock;
  let mockObserve: jest.Mock;
  let mockDisconnect: jest.Mock;

  beforeEach(() => {
    mockLoadMore = jest.fn();
    mockObserve = jest.fn();
    mockDisconnect = jest.fn();

    global.IntersectionObserver = class IntersectionObserver {
      constructor(
        public callback: (entries: IntersectionObserverEntry[]) => void,
        public options?: IntersectionObserverInit
      ) {}

      observe = mockObserve;
      disconnect = mockDisconnect;
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should not observe when isInfiniteScrolling is false", () => {
    const { result } = renderHook(() => useObserver(false, mockLoadMore));

    expect(result.current.current).toBe(null);
    expect(mockObserve).not.toHaveBeenCalled();
  });
});
