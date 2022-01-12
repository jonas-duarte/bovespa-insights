import React from "react";
import styles from "./table.module.css";

interface TableProps<D> {
  columns: {
    title: string;
    dataIndex: string;
  }[];
  dataKey: keyof D;
  data: D[];
  onRowClick?: (data: D) => void;
}

interface TableState {}

function getValueFromPath(obj: any, path: string) {
  return path.split(".").reduce((acc, curr) => acc[curr], obj);
}

class Table<D> extends React.Component<TableProps<D>, TableState> {
  state = {};
  render() {
    const { columns, data, onRowClick } = this.props;
    return (
      <div className={styles.table}>
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.title}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[this.props.dataKey] as unknown as string} onClick={() => onRowClick && onRowClick(row)}>
                {columns.map((column) => (
                  <td key={column.dataIndex}>{getValueFromPath(row, column.dataIndex)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Table;
