import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Table from "./";

const mockTodos = [
  { id: 1, content: "Item 1", done: false, done_time: null },
  { id: 2, content: "Item 2", done: true, done_time: "2023-08-21T12:34:56" },
];

const mockColumns = [
  {
    Header: "ID",
    accessor: "id" as const,
    width: "50px",
  },
  {
    Header: "Content",
    accessor: "content" as const,
    width: "300px",
  },
  {
    Header: "Status",
    accessor: "done" as const,
    width: "100px",
  },
  {
    Header: "Done Time",
    accessor: "done_time" as const,
    width: "200px",
  },
];

describe("Table", () => {
  test("renders table with provided items and columns", () => {
    render(
      <Table
        items={mockTodos}
        columns={mockColumns}
      />
    );

    expect(screen.getByRole("table")).toBeInTheDocument();

    expect(screen.getByText(/ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Content/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Done Time/i)).toBeInTheDocument();

    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
  });

  test("renders table rows correctly", () => {
    render(
      <Table
        items={mockTodos}
        columns={mockColumns}
      />
    );

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(mockTodos.length + 1);

    expect(screen.getByText(/Item 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Item 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Done/i)).toBeInTheDocument();
    expect(screen.getByText(/2023-08-21T12:34:56/i)).toBeInTheDocument();
  });
});
