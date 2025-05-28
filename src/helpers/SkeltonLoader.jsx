import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonTable = ({ rows = 3, columns = [200, 150, 100] }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {columns?.map((width, colIndex) => (
            <td key={colIndex}>
              <Skeleton width={width} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default SkeletonTable;
