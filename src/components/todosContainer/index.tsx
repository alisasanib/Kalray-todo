import { useCallback, useMemo, useState } from "react";
import { CellProps, Column } from "react-table";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import WarningIcon from "@mui/icons-material/Warning";
import { SelectChangeEvent } from "@mui/material";
import { Todo } from "../../types/todo.dto";
import Input from "../common/input";
import CustomCheckbox from "../common/checkbox";
import Modal from "../common/modal";
import CustomButton from "../common/button";
import Select from "../common/select";
import Table from "../common/table";
import useFetchTodos from "../../hooks/useFetchTodos";
import usePagination from "../../hooks/usePagination";
import useSort from "../../hooks/useSort";
import useModal from "../../hooks/useModal";
import useObserver from "../../hooks/useObserver";
import "./TodosContainer.sass";

const TodosContainer = () => {
  const { todos, setTodos, error, isLoading } = useFetchTodos();
  const [isInfiniteScrolling, setIsInfiniteScrolling] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const { displayedTodos, paginationIndex, setPaginationIndex, handlePaginationBackward, handlePaginationForward } =
    usePagination(todos, isInfiniteScrolling, searchTerm, itemsPerPage);

  const { sortConfig, handleSort } = useSort(todos, setTodos);

  const {
    selectedTodo,
    isModalOpen,
    isEditMode,
    setIsModalOpen,
    handleEdit,
    handleDelete,
    handleSaveTodo,
    handleAddTask,
    setSelectedTodo,
  } = useModal(setTodos);

  const observerRef = useObserver(isInfiniteScrolling, () => setPaginationIndex((prev) => prev + 1));

  const togglePaginationMode = useCallback(() => {
    setIsInfiniteScrolling((prev) => !prev);
    setPaginationIndex(0);
  }, [setPaginationIndex]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSwitchStatus = useCallback((row: Todo) => {
    setTodos((prevState) =>
      prevState.map((todo) =>
        todo.id === row.id
          ? { ...todo, done: !todo.done, done_time: todo.done ? null : new Date().toISOString().slice(0, 19) }
          : todo
      )
    );
  }, []);

  const handleItemsPerPageChange = useCallback((event: SelectChangeEvent<number>) => {
    setItemsPerPage(Number(event.target.value));
    setPaginationIndex(0);
  }, []);

  const columns: Column<Todo>[] = useMemo(
    () => [
      {
        accessor: "done",
        Cell: ({ row }: CellProps<Todo>) => (
          <div className={row.original.done ? "status-done" : "status-progress"}>
            <CustomCheckbox
              checkboxProps={{
                checked: row.original.done,
                onChange: () => handleSwitchStatus(row.original),
              }}
            />
            {row.original.done ? "Done" : "In progress"}
          </div>
        ),
        width: "40px",
        Header: () => (
          <div
            onClick={() => handleSort("done")}
            style={{ cursor: "pointer", display: "flex", gap: 10, height: 20 }}>
            Status{" "}
            {sortConfig.key === "done" &&
              (sortConfig.ascending ? (
                <KeyboardArrowUpIcon fontSize='small' />
              ) : (
                <KeyboardArrowDownIcon fontSize='small' />
              ))}
          </div>
        ),
      },
      {
        Header: () => (
          <div
            onClick={() => handleSort("content")}
            style={{ cursor: "pointer", display: "flex", gap: 10, height: 20 }}>
            Content{" "}
            {sortConfig.key === "content" &&
              (sortConfig.ascending ? (
                <KeyboardArrowUpIcon fontSize='small' />
              ) : (
                <KeyboardArrowDownIcon fontSize='small' />
              ))}
          </div>
        ),
        accessor: "content",
        Cell: ({ row, cell }: CellProps<Todo>) => (
          <div className={row.original.done ? "cell-done" : ""}>{cell.value}</div>
        ),
        width: 300,
      },
      {
        Header: () => (
          <div
            onClick={() => handleSort("done_time")}
            style={{ cursor: "pointer", display: "flex", gap: 10, height: 20 }}>
            Completion Time{" "}
            {sortConfig.key === "done_time" &&
              (sortConfig.ascending ? (
                <KeyboardArrowUpIcon fontSize='small' />
              ) : (
                <KeyboardArrowDownIcon fontSize='small' />
              ))}
          </div>
        ),
        accessor: "done_time",
        width: 300,
      },
      {
        Header: "Actions",
        Cell: ({ row }: CellProps<Todo>) => (
          <div>
            <CustomButton onClick={() => handleEdit(row.original)}>Edit</CustomButton>
            <CustomButton
              color='error'
              onClick={() => handleDelete(row.original.id)}>
              Delete
            </CustomButton>
          </div>
        ),
        width: 40,
      },
    ],
    [sortConfig, handleEdit]
  );

  return (
    <div>
      <div className='action-buttons'>
        <CustomCheckbox
          labelProps={{
            label: "Infinite scrolling",
            sx: { marginRight: 0 },
          }}
          checkboxProps={{
            checked: isInfiniteScrolling,
            onChange: togglePaginationMode,
          }}
        />
        <Input
          style={{ width: 300 }}
          inputProps={{
            value: searchTerm,
            onChange: handleSearch,
            placeholder: "Search...",
            sx: { height: "50px" },
          }}
          endIconProps={{
            sx: { cursor: "pointer" },
            onClick: () => {
              setSearchTerm("");
            },
          }}
          startIcon={<SearchIcon />}
          endIcon={<CloseIcon />}
        />
        <CustomButton
          sx={{ height: "50px" }}
          variant='contained'
          onClick={handleAddTask}
          disabled={!!error || isLoading}
          >
          Add new task
        </CustomButton>
      </div>
      {isLoading && <p>Loading todos...</p>}
      {error && (
        <div className='todos-container-error'>
          <WarningIcon />
          <span>{error}</span>
        </div>
      )}
      <div>
        {displayedTodos.length > 0 && (
          <Table<Todo>
            items={displayedTodos}
            columns={columns}
          />
        )}
      </div>
      {!isInfiniteScrolling && (
        <div className='pagination'>
          <Select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            options={[
              { value: 10, label: "10 items per page" },
              { value: todos.length, label: "All items" },
            ]}
            style={{ height: 30 }}
          />
          <CustomButton
            disabled={paginationIndex === 0}
            onClick={handlePaginationBackward}>{`<`}</CustomButton>
          {paginationIndex + 1}
          <CustomButton
            disabled={paginationIndex + 1 >= Math.ceil(todos.length / itemsPerPage)}
            onClick={handlePaginationForward}>
            {`>`}
          </CustomButton>
        </div>
      )}
      {isInfiniteScrolling && <div ref={observerRef}></div>}
      {isModalOpen && (
        <Modal
          title={isEditMode ? "Edit task" : "Create new task"}
          visible={isModalOpen}
          onOK={handleSaveTodo}
          oKText='Save'
          cancelText='Cancel'
          handleClose={() => {
            setIsModalOpen(false);
            setSelectedTodo(null);
          }}
          handleCancel={() => {
            setIsModalOpen(false);
            setSelectedTodo(null);
          }}
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                {isEditMode && <div style={{ width: "10%" }}>Status</div>}
                <div style={{ width: "80%" }}>Task</div>
              </div>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {isEditMode && (
                  <div style={{ width: "10%" }}>
                    <CustomCheckbox
                      checkboxProps={{
                        checked: selectedTodo?.done,
                        onChange: () => setSelectedTodo((prev) => (prev ? { ...prev, done: !prev.done } : prev)),
                      }}
                    />
                  </div>
                )}
                <div style={{ width: "80%" }}>
                  <Input
                    inputProps={{
                      multiline: true,
                      placeholder: "Add task here",
                      value: selectedTodo?.content || "",
                      onChange: (e) => {
                        setSelectedTodo((prev) => (prev ? { ...prev, content: e.target.value } : prev));
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          }
        />
      )}
    </div>
  );
};

export default TodosContainer;
