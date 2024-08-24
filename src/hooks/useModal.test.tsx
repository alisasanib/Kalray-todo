import { renderHook, act } from "@testing-library/react-hooks";
import useModal from "./useModal";
import { Todo } from "../types/todo.dto";

describe("useModal", () => {
  let setTodosMock: jest.Mock;

  beforeEach(() => {
    setTodosMock = jest.fn();
  });

  test("should initialize with correct default state", () => {
    const { result } = renderHook(() => useModal(setTodosMock));

    expect(result.current.selectedTodo).toBeNull();
    expect(result.current.isModalOpen).toBe(false);
    expect(result.current.isEditMode).toBe(false);
  });

  test("should open modal and set up for editing a todo", () => {
    const { result } = renderHook(() => useModal(setTodosMock));
    const todoToEdit: Todo = { id: 1, content: "Test Todo", done: false, done_time: null };

    act(() => {
      result.current.handleEdit(todoToEdit);
    });

    expect(result.current.selectedTodo).toEqual(todoToEdit);
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.isEditMode).toBe(true);
  });

  test("should delete a todo", () => {
    const { result } = renderHook(() => useModal(setTodosMock));
    const todos: Todo[] = [
      { id: 1, content: "First Todo", done: false, done_time: null },
      { id: 2, content: "Second Todo", done: true, done_time: "2023-08-21T12:34:56" },
    ];

    act(() => {
      result.current.handleDelete(1);
    });

    expect(setTodosMock).toHaveBeenCalledWith(expect.any(Function));

    const callback = setTodosMock.mock.calls[0][0];
    const updatedTodos = callback(todos);

    expect(updatedTodos).toEqual([{ id: 2, content: "Second Todo", done: true, done_time: "2023-08-21T12:34:56" }]);
  });

  test("should open modal for adding a new task", () => {
    const { result } = renderHook(() => useModal(setTodosMock));

    act(() => {
      result.current.handleAddTask();
    });

    expect(result.current.selectedTodo).toEqual({ id: 0, content: "", done: false, done_time: null });
    expect(result.current.isModalOpen).toBe(true);
    expect(result.current.isEditMode).toBe(false);
  });

  test("should reset selected todo when modal is closed", () => {
    const { result } = renderHook(() => useModal(setTodosMock));

    act(() => {
      result.current.setIsModalOpen(false);
    });

    expect(result.current.selectedTodo).toBeNull();
  });
});
