import { useMemo } from "react";
import { useTable, Column } from "react-table";
import "./Table.sass";

interface TableProps<TData extends object> {
  items: TData[];
  columns: Column<TData>[];
}

const Table = <TData extends object>({ items, columns }: TableProps<TData>) => {
  const data = useMemo(() => items, [items]);

  const tableInstance = useTable({ columns: columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = tableInstance;

  return (
    <>
      <table
        {...getTableProps()}
        className='table'>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr
              className='table-header-row'
              {...headerGroup.getHeaderGroupProps()}
              key={index}>
              {headerGroup.headers.map((column) => {
                return (
                  <th
                    className='table-header'
                    {...column.getHeaderProps()}
                    style={{
                      width: column.width,
                    }}
                    key={column.id}>
                    {column.render("Header")}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id}>
                {row.cells.map((cell) => (
                  <td
                    className='table-cell'
                    {...cell.getCellProps()}
                    key={`${row.id}-${cell.column.id}`}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Table;
