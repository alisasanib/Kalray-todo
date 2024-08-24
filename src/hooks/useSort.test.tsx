import { renderHook, act } from "@testing-library/react-hooks";
import useSort from "./useSort";
import { Todo } from "../types/todo.dto";

const mockTodos: Todo[] = [
  { id: 1, content: "Item 1", done: false, done_time: null },
  { id: 2, content: "Item 2", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 3, content: "Item 3", done: false, done_time: null },
];

describe("useSort", () => {
  test("should initialize with correct default values", () => {
    const { result } = renderHook(() => useSort(mockTodos, jest.fn()));

    expect(result.current.sortConfig).toEqual({ key: "", ascending: false });
  });

  test("should update sort config correctly when handleSort is called", () => {
    const { result } = renderHook(() => useSort(mockTodos, jest.fn()));

    act(() => {
      result.current.handleSort("content");
    });

    expect(result.current.sortConfig).toEqual({ key: "content", ascending: true });

    act(() => {
      result.current.handleSort("content");
    });

    expect(result.current.sortConfig).toEqual({ key: "content", ascending: false });
  });

  test("should sort todos by a string key in ascending order", () => {
    const setTodosMock = jest.fn();
    const { result } = renderHook(() => useSort(mockTodos, setTodosMock));

    act(() => {
      result.current.handleSort("content");
    });

    const updateFn = setTodosMock.mock.calls[0][0];
    const sortedTodos = updateFn(mockTodos);

    const expectedAscendingOrder = [
      { id: 1, content: "Item 1", done: false, done_time: null },
      { id: 2, content: "Item 2", done: true, done_time: "2023-08-21T12:34:56" },
      { id: 3, content: "Item 3", done: false, done_time: null },
    ];

    expect(sortedTodos).toEqual(expectedAscendingOrder);
  });

  test("should sort todos by a string key in descending order", () => {
    const setTodosMock = jest.fn();
    const { result } = renderHook(() => useSort(mockTodos, setTodosMock));

    act(() => {
      result.current.handleSort("content");
    });

    act(() => {
      result.current.handleSort("content");
    });

    const updateFn = setTodosMock.mock.calls[1][0];
    const sortedTodos = updateFn(mockTodos);

    const expectedDescendingOrder = [
      { id: 3, content: "Item 3", done: false, done_time: null },
      { id: 2, content: "Item 2", done: true, done_time: "2023-08-21T12:34:56" },
      { id: 1, content: "Item 1", done: false, done_time: null },
    ];

    expect(sortedTodos).toEqual(expectedDescendingOrder);
  });

  test("should sort todos by a boolean key in ascending order", () => {
    const setTodosMock = jest.fn();
    const { result } = renderHook(() => useSort(mockTodos, setTodosMock));

    act(() => {
      result.current.handleSort("done");
    });

    const updateFn = setTodosMock.mock.calls[0][0];
    const sortedTodos = updateFn(mockTodos);

    const expectedAscendingOrder = [
      { id: 1, content: "Item 1", done: false, done_time: null },
      { id: 3, content: "Item 3", done: false, done_time: null },
      { id: 2, content: "Item 2", done: true, done_time: "2023-08-21T12:34:56" },
    ];

    expect(sortedTodos).toEqual(expectedAscendingOrder);
  });

  test("should sort todos by a boolean key in descending order", () => {
    const setTodosMock = jest.fn();
    const { result } = renderHook(() => useSort(mockTodos, setTodosMock));

    act(() => {
      result.current.handleSort("done");
    });

    act(() => {
      result.current.handleSort("done");
    });

    const updateFn = setTodosMock.mock.calls[1][0];
    const sortedTodos = updateFn(mockTodos);

    const expectedDescendingOrder = [
      { id: 2, content: "Item 2", done: true, done_time: "2023-08-21T12:34:56" },
      { id: 1, content: "Item 1", done: false, done_time: null },
      { id: 3, content: "Item 3", done: false, done_time: null },
    ];

    expect(sortedTodos).toEqual(expectedDescendingOrder);
  });
});
