import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodosContainer from ".";
import { useFetchTodos, usePagination, useSort, useModal, useObserver } from "../../hooks";
import { Todo } from "../../types/todo.dto";

jest.mock("../../hooks/useFetchTodos");
jest.mock("../../hooks/usePagination");
jest.mock("../../hooks/useSort");
jest.mock("../../hooks/useModal");
jest.mock("../../hooks/useObserver");

describe("TodosContainer integration", () => {
  const todosMockData = [
    { id: 1, content: "Test Todo 1", done: false },
    { id: 2, content: "Another Todo", done: true },
  ];

  beforeEach(() => {
    (useFetchTodos as jest.Mock).mockReturnValue({
      todos: todosMockData,
      setTodos: jest.fn(),
      error: null,
      isLoading: false,
    });

    (usePagination as jest.Mock).mockImplementation((todos: Todo[], isInfiniteScrolling, searchTerm) => {
      const filteredTodos = todos.filter((todo) => todo.content.toLowerCase().includes(searchTerm.toLowerCase()));

      return {
        displayedTodos: filteredTodos,
        paginationIndex: 0,
        setPaginationIndex: jest.fn(),
        handlePaginationBackward: jest.fn(),
        handlePaginationForward: jest.fn(),
      };
    });

    (useSort as jest.Mock).mockReturnValue({
      sortConfig: { key: "content", ascending: true },
      handleSort: jest.fn(),
    });

    (useModal as jest.Mock).mockReturnValue({
      selectedTodo: null,
      isModalOpen: false,
      isEditMode: false,
      setIsModalOpen: jest.fn(),
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      handleSaveTodo: jest.fn(),
      handleAddTask: jest.fn(),
      setSelectedTodo: jest.fn(),
    });

    (useObserver as jest.Mock).mockReturnValue({
      observerRef: { current: null },
    });
  });

  test("should render loading state", () => {
    (useFetchTodos as jest.Mock).mockReturnValueOnce({
      todos: [],
      setTodos: jest.fn(),
      error: null,
      isLoading: true,
    });

    render(<TodosContainer />);

    expect(screen.getByText("Loading todos...")).toBeInTheDocument();
  });

  test("renders error message when there is an error", () => {
    (useFetchTodos as jest.Mock).mockReturnValueOnce({
      todos: [],
      setTodos: jest.fn(),
      error: "Error loading todos",
      isLoading: false,
    });

    render(<TodosContainer />);

    expect(screen.getByText("Error loading todos")).toBeInTheDocument();
  });

  test("should display todos when data is loaded", () => {
    render(<TodosContainer />);

    expect(screen.getByText("Test Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Another Todo")).toBeInTheDocument();
  });

  test("should filter todos based on search input", async () => {
    render(<TodosContainer />);

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "Another" } });

    await waitFor(() => {
      expect(screen.queryByText("Test Todo 1")).not.toBeInTheDocument();
      expect(screen.getByText("Another Todo")).toBeInTheDocument();
    });
  });

  test("should add a new todo", async () => {
    (useModal as jest.Mock).mockReturnValueOnce({
      selectedTodo: { id: 3, content: "New Todo", done: false },
      isModalOpen: true,
      isEditMode: false,
      setIsModalOpen: jest.fn(),
      handleEdit: jest.fn(),
      handleDelete: jest.fn(),
      handleSaveTodo: jest.fn(),
      handleAddTask: jest.fn(),
      setSelectedTodo: jest.fn(),
    });

    render(<TodosContainer />);

    const addButton = screen.getByText("Add new task");
    fireEvent.click(addButton);

    expect(screen.getByText("Create new task")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Add task here");
    fireEvent.change(input, { target: { value: "New Todo" } });

    const saveButton = screen.getByText("Save");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText("New Todo")).toBeInTheDocument();
    });
  });
  test("should toggles infinite scrolling mode", () => {
    render(<TodosContainer />);

    const infiniteScrollCheckbox = screen.getByLabelText("Infinite scrolling") as HTMLInputElement;
    fireEvent.click(infiniteScrollCheckbox);

    expect(infiniteScrollCheckbox.checked).toBe(false);

    expect(screen.getByText("<")).toBeInTheDocument();
    expect(screen.getByText(">")).toBeInTheDocument();
  });
});
