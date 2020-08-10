import React from "react";
import numeral from "numeral";

const Table = ({ countries }) => {
  return (
    <div className="table-wrapper">
      <div className="table-scroll">
        <table className="table">
          <tbody>
            {countries.map(({ country, cases }, id) => (
              <tr key={`table-tr-${id}`}>
                <td>{country}</td>
                <td>{numeral(cases).format("0,0")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
