import { renderHook, act } from "@testing-library/react-hooks";
import usePagination from "./usePagination";
import { Todo } from "../types/todo.dto";

const mockTodos: Todo[] = [
  { id: 1, content: "Todo 1", done: false, done_time: null },
  { id: 2, content: "Todo 2", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 3, content: "Another Todo", done: false, done_time: null },
  { id: 4, content: "One more Todo", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 5, content: "Final Todo", done: false, done_time: null },
  { id: 6, content: "Todo 1", done: false, done_time: null },
  { id: 7, content: "Todo 2", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 8, content: "Another Todo", done: false, done_time: null },
  { id: 9, content: "One more Todo", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 10, content: "Final Todo", done: false, done_time: null },
  { id: 11, content: "Todo 1", done: false, done_time: null },
  { id: 12, content: "Todo 2", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 13, content: "Another Todo", done: false, done_time: null },
  { id: 14, content: "One more Todo", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 15, content: "Final Todo", done: false, done_time: null },
  { id: 16, content: "Todo 1", done: false, done_time: null },
  { id: 17, content: "Todo 2", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 18, content: "Another Todo", done: false, done_time: null },
  { id: 19, content: "One more Todo", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 20, content: "Final Todo", done: false, done_time: null },
];

describe("usePagination", () => {
  test("initializes with correct values", () => {
    const { result } = renderHook(() => usePagination(mockTodos, false, ""));

    expect(result.current.paginationIndex).toBe(0);
    expect(result.current.displayedTodos).toEqual(mockTodos.slice(0, 10));
  });

  test("handles infinite scrolling mode correctly", () => {
    const { result } = renderHook(() => usePagination(mockTodos, true, ""));

    expect(result.current.displayedTodos).toEqual(mockTodos.slice(0, 10));

    act(() => {
      result.current.setPaginationIndex(1);
    });

    expect(result.current.displayedTodos).toEqual(mockTodos.slice(0, 20));
  });

  test("filters todos based on search term", () => {
    const { result } = renderHook(() => usePagination(mockTodos, false, "Another"));

    expect(result.current.displayedTodos).toEqual(
      mockTodos.filter((todo) => todo.content.toLowerCase().includes("another".toLowerCase())).slice(0, 10)
    );
  });

  test("handles pagination forward correctly", () => {
    const { result } = renderHook(() => usePagination(mockTodos, false, ""));

    act(() => {
      result.current.handlePaginationForward();
    });

    expect(result.current.paginationIndex).toBe(1);
    expect(result.current.displayedTodos).toEqual(mockTodos.slice(10, 20));
  });

  test("handles pagination backward correctly", () => {
    const { result } = renderHook(() => usePagination(mockTodos, false, ""));

    act(() => {
      result.current.setPaginationIndex(2);
    });

    act(() => {
      result.current.handlePaginationBackward();
    });

    expect(result.current.paginationIndex).toBe(1);
    expect(result.current.displayedTodos).toEqual(mockTodos.slice(10, 20));
  });

  test("does not go below pagination index 0 when moving backward", () => {
    const { result } = renderHook(() => usePagination(mockTodos, false, ""));

    act(() => {
      result.current.handlePaginationBackward();
    });

    expect(result.current.paginationIndex).toBe(0);
  });

  test("loads more items when infinite scrolling and increasing index", () => {
    const { result } = renderHook(() => usePagination(mockTodos, true, ""));

    act(() => {
      result.current.setPaginationIndex(1);
    });

    expect(result.current.displayedTodos.length).toBeGreaterThan(10);
    expect(result.current.displayedTodos).toEqual(mockTodos.slice(0, 20));
  });
});
