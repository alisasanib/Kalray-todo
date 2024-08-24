import { useCallback, useEffect, useState } from "react";
import { Todo } from "../types/todo.dto";

const usePagination = (todos: Todo[], isInfiniteScrolling: boolean, searchTerm: string, itemsPerPage: number = 10) => {
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [displayedTodos, setDisplayedTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const filteredTodos = todos.filter((todo) => todo.content.toLowerCase().includes(searchTerm.toLowerCase()));

    if (isInfiniteScrolling) {
      setDisplayedTodos(filteredTodos.slice(0, (paginationIndex + 1) * itemsPerPage));
    } else {
      setDisplayedTodos(filteredTodos.slice(paginationIndex * itemsPerPage, (paginationIndex + 1) * itemsPerPage));
    }
  }, [paginationIndex, todos, isInfiniteScrolling, searchTerm, itemsPerPage]);

  const handlePaginationBackward = useCallback(() => {
    setPaginationIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const handlePaginationForward = useCallback(() => {
    setPaginationIndex((prev) => prev + 1);
  }, []);

  return {
    displayedTodos,
    paginationIndex,
    setPaginationIndex,
    handlePaginationBackward,
    handlePaginationForward,
  };
};

export default usePagination;
