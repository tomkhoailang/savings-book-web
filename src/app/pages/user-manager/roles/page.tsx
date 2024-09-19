"use client"

import React, { useState } from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue} from "@nextui-org/react";



const rows = [
  {
    key: "1",
    username: "user1",
    name: "Tony Reichert",
    idnumber: "123456754321",
    role: "Staff",
  },
  {
    key: "2",
    username: "user2",
    name: "Mark Hummer",
    idnumber: "840937227483",
    role: "Staff",
  },
  {
    key: "3",
    username: "user3",
    name: "David Tom",
    idnumber: "537826382644",
    role: "Customer",
  },
  {
    key: "4",
    username: "user4",
    name: "Chris Smith",
    idnumber: "352678677390",
    role: "Customer",
  },
];

const columns = [
  {
    key: "username",
    label: "USERNAME",
  },
  {
    key: "name",
    label: "NAME",
  },
  {
    key: "idnumber",
    label: "ID CARD NUMBER",
  },
  {
    key: "role",
    label: "ROLE",
  },
  {
    key: "setting",
    label: "",
  },
];

export default function App() {
  const [hover, setHover] = useState(false);

  const buttonStyle = {
    backgroundColor: hover ? "#FFFFFF" : "transparent",
    border: "none",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "5px",
  };
  
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 4;

  const pages = Math.ceil(rows.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows.slice(start, end);
  }, [page, rows]);

  return (
    <Table 
      aria-label="Example table with client side pagination"
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>}
         classNames={{
          wrapper: "min-h-[222px]",
        }}>
      
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
         <TableRow key={item.key}>
         {(columnKey) =>
           columnKey === "setting" ? (
             <TableCell style={{ textAlign: "center" }}>
               <button
                style={buttonStyle}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                >
                <img 
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/edit.png"
                  alt="edit"
                  style={{ width: "20px", height: "20px"}}/>
               </button>
             </TableCell>
           ) : (
             <TableCell style={{ textAlign: "center" }}>{getKeyValue(item, columnKey)}</TableCell>
           )
         }
       </TableRow>
        )}
      </TableBody>
    </Table>
  );
}


