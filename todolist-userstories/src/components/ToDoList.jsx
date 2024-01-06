import React, { useEffect, useState } from "react";
import ToDoAddForm from "./ToDoAddForm";

const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      {toDoList.map((task) => {
        return (
          <div key={task.id}>
            <p>{task.taskName}</p>
          </div>
        );
      })}
      <ToDoAddForm setToDoList={setToDoList} />
    </div>
  );
};

export default ToDoList;
