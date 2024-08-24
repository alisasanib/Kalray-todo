import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import TodosContainer from "./";
import { useFetchTodos, usePagination, useSort, useModal, useObserver } from "../../hooks";

jest.mock("../../hooks/useFetchTodos");
jest.mock("../../hooks/usePagination");
jest.mock("../../hooks/useSort");
jest.mock("../../hooks/useModal");
jest.mock("../../hooks/useObserver");

const mockSetTodos = jest.fn();
const mockHandleSort = jest.fn();
const mockSetPaginationIndex = jest.fn();
const mockHandleEdit = jest.fn();
const mockHandleDelete = jest.fn();
const mockHandleAddTask = jest.fn();
const mockSetIsModalOpen = jest.fn();
const mockHandleSaveTodo = jest.fn();
const mockSetSelectedTodo = jest.fn();
const mockObserverRef = jest.fn();

const todosMock = [
  { id: 1, content: "Todo 1", done: false, done_time: null },
  { id: 2, content: "Todo 2", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 3, content: "Todo 3", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 4, content: "Todo 4", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 5, content: "Todo 5", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 6, content: "Todo 6", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 7, content: "Todo 7", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 8, content: "Todo 8", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 9, content: "Todo 9", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 10, content: "Todo 10", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 11, content: "Todo 11", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 12, content: "Todo 12", done: true, done_time: "2023-08-21T12:34:56" },
  { id: 13, content: "Todo 13", done: true, done_time: "2023-08-21T12:34:56" },
];

beforeEach(() => {
  (useFetchTodos as jest.Mock).mockReturnValue({
    todos: todosMock,
    setTodos: mockSetTodos,
  });

  (usePagination as jest.Mock).mockReturnValue({
    displayedTodos: todosMock,
    paginationIndex: 0,
    setPaginationIndex: mockSetPaginationIndex,
    handlePaginationBackward: jest.fn(),
    handlePaginationForward: jest.fn(),
  });

  (useSort as jest.Mock).mockReturnValue({
    sortConfig: { key: "", ascending: true },
    handleSort: mockHandleSort,
  });

  (useModal as jest.Mock).mockReturnValue({
    selectedTodo: null,
    isModalOpen: false,
    isEditMode: false,
    setIsModalOpen: mockSetIsModalOpen,
    handleEdit: mockHandleEdit,
    handleDelete: mockHandleDelete,
    handleSaveTodo: mockHandleSaveTodo,
    handleAddTask: mockHandleAddTask,
    setSelectedTodo: mockSetSelectedTodo,
  });

  (useObserver as jest.Mock).mockReturnValue(mockObserverRef);
});

describe("TodosContainer", () => {
  test("renders TodoTable with todos", () => {
    render(<TodosContainer />);

    expect(screen.getByText("Todo 1")).toBeInTheDocument();
    expect(screen.getByText("Todo 2")).toBeInTheDocument();
  });

  test("should toggle infinite scrolling mode", () => {
    render(<TodosContainer />);

    const checkbox = screen.getByLabelText("Infinite scrolling");
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(mockSetPaginationIndex).toHaveBeenCalledWith(0);
  });

  test("should handle search input change", () => {
    render(<TodosContainer />);

    const searchInput = screen.getByPlaceholderText("Search...");
    fireEvent.change(searchInput, { target: { value: "New search" } });
    expect(searchInput).toHaveValue("New search");
  });

  test("should add a new task", () => {
    render(<TodosContainer />);

    const addButton = screen.getByText("Add new task");
    fireEvent.click(addButton);
    expect(mockHandleAddTask).toHaveBeenCalled();
  });

  test("should open modal on Edit button click", () => {
    render(<TodosContainer />);

    const editButton = screen.getAllByText("Edit")[0];
    fireEvent.click(editButton);
    expect(mockHandleEdit).toHaveBeenCalledWith(todosMock[0]);
  });

  test("should delete a task", () => {
    render(<TodosContainer />);

    const deleteButton = screen.getAllByText("Delete")[0];
    fireEvent.click(deleteButton);
    expect(mockHandleDelete).toHaveBeenCalledWith(1);
  });

  test("should sort todos by status", () => {
    render(<TodosContainer />);

    const statusHeader = screen.getByText("Status");
    fireEvent.click(statusHeader);
    expect(mockHandleSort).toHaveBeenCalledWith("done");
  });

  test("should handle pagination backward and forward", async () => {
    render(<TodosContainer />);

    const checkbox = screen.getByLabelText("Infinite scrolling");
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);

    const forwardButton = screen.getByText(">");
    fireEvent.click(forwardButton);
    await waitFor(() => expect(mockSetPaginationIndex).toHaveBeenCalled());

    const backwardButton = screen.getByText("<");

    fireEvent.click(backwardButton);
    await waitFor(() => expect(mockSetPaginationIndex).toHaveBeenCalled());
  });

  test("renders modal when isModalOpen is true", () => {
    (useModal as jest.Mock).mockReturnValue({
      ...useModal,
      isModalOpen: true,
      isEditMode: true,
      selectedTodo: todosMock[0],
    });

    render(<TodosContainer />);

    expect(screen.getByText("Edit task")).toBeInTheDocument();
  });
});
