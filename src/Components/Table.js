import React from "react";

const Table = ({ countries }) => {
  return (
    <div className="table">
      {countries.map(({ country, cases }, id) => (
        <tr key={`table-tr-${id}`}>
          <td>{country}</td>
          <td>{cases}</td>
        </tr>
      ))}
    </div>
  );
};

export default Table;
