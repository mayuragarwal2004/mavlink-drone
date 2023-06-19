import React, { useState } from 'react';

const Table = () => {
  const [wm, setwm] = useState('With Material');

  function handleclick() {
    if (wm === 'Only Labor') {
      setwm('With Material');
    } else {
      setwm('Only Labor');
    }
  }
  return (
    <>
      <table id="maintable">
        <tr>
          <th>File Name</th>
          <th>Only Labor/With Material</th>
          <th>Material</th>
          <th>Thickness</th>
          <th>Quantity</th>
          <th>Per Piece Cost</th>
          <th>Total Cost</th>
        </tr>
        <tr>
          <td>
            <input type="text" id="cell" />
          </td>
          <td>
            <span className="wmbox">
              {wm}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <button
                style={{ position: 'absolute' }}
                type="button"
                onClick={handleclick}
              >
                <i className="fa fa-exchange" />
              </button>
            </span>
          </td>
          <td>
            <select name="m" id="m">
              <option value="MS">MS</option>
              <option value="SS" selected>
                SS
              </option>
              <option value="AL">AL</option>
              <option value="CU">CU</option>
            </select>
          </td>
        </tr>
        <tr>
          <td>
            <input type="text" id="cell" />
          </td>
          <td>
            <select name="wm" id="wm">
              <option value="With Material">With Material</option>
              <option value="Only Labor">Only Labor</option>
            </select>
          </td>
          <td>2Bye2</td>
          <td>2Bye3</td>
        </tr>
      </table>
    </>
  );
};

export default Table;
