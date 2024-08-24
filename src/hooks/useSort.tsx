import { useCallback, useEffect, useState } from "react";
import { Todo } from "../types/todo.dto";
const useSort = (todos: Todo[], setTodos: React.Dispatch<React.SetStateAction<Todo[]>>) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; ascending: boolean }>({
    key: "",
    ascending: false,
  });

  const handleSort = useCallback(
    (key: string) => {
      setSortConfig((prev) => {
        const isAscending = prev.key === key ? !prev.ascending : true;
        return { key, ascending: isAscending };
      });
    },
    [setSortConfig]
  );

  useEffect(() => {
    if (sortConfig.key) {
      setTodos((prevTodos) => {
        return [...prevTodos].sort((a, b) => {
          const aValue = a[sortConfig.key as keyof Todo];
          const bValue = b[sortConfig.key as keyof Todo];

          let compareResult = 0;

          if (typeof aValue === "boolean" && typeof bValue === "boolean") {
            compareResult = aValue === bValue ? 0 : aValue ? 1 : -1;
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            compareResult = aValue - bValue;
          } else {
            compareResult = String(aValue).localeCompare(String(bValue), undefined, {
              numeric: true,
              sensitivity: "base",
            });
          }

          return sortConfig.ascending ? compareResult : -compareResult;
        });
      });
    }
  }, [sortConfig, setTodos]);

  return { sortConfig, handleSort };
};

export default useSort;
