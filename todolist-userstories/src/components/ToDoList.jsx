import React, { useEffect, useState } from "react";
import ToDoAddForm from "./ToDoAddForm";

const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  return (
    <div>
      <ToDoAddForm setToDoList={setToDoList} />
    </div>
  );
};

export default ToDoList;
