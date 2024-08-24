import { useCallback, useEffect, useState } from "react";
import { Todo } from "../types/todo.dto";

const useModal = (setTodos: React.Dispatch<React.SetStateAction<Todo[]>>) => {
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = useCallback((todo: Todo) => {
    setSelectedTodo(todo);
    setIsEditMode(true);
    setIsModalOpen(true);
  }, []);

  const handleSaveTodo = useCallback(() => {
    setIsModalOpen(false);
    if (isEditMode && selectedTodo && selectedTodo.content) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === selectedTodo.id
            ? { ...selectedTodo, done_time: selectedTodo.done ? new Date().toISOString().slice(0, 19) : null }
            : todo
        )
      );
    } else if (selectedTodo && selectedTodo.content) {
      setTodos((prevTodos) => [
        ...prevTodos,
        { ...selectedTodo, id: prevTodos.length + 1, done: false, done_time: null },
      ]);
    }
  }, [selectedTodo, isEditMode, setTodos]);

  const handleDelete = useCallback(
    (id: number) => {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    },
    [setTodos]
  );

  useEffect(() => {
    if (!isModalOpen) {
      setSelectedTodo(null);
    }
  }, [isModalOpen]);

  const handleAddTask = useCallback(() => {
    setSelectedTodo({ id: 0, content: "", done: false, done_time: null });
    setIsEditMode(false);
    setIsModalOpen(true);
  }, []);

  return {
    selectedTodo,
    isModalOpen,
    isEditMode,
    setIsModalOpen,
    handleEdit,
    handleSaveTodo,
    handleAddTask,
    handleDelete,
    setSelectedTodo,
  };
};

export default useModal;
