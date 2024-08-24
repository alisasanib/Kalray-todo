import { useCallback, useEffect, useState } from "react";
import { Todo } from "../types/todo.dto";
import service from "../services/appService";

const useFetchTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await service.getToDoList();
      setTodos(data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to fetch todos. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { todos, setTodos, error, isLoading };
};

export default useFetchTodos;
