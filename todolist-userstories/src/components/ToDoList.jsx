import React, { useEffect, useState } from "react";
import ToDoAddForm from "./ToDoAddForm";

const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  useEffect(() => {
    const toDoListString = localStorage.getItem("toDoList");
    setToDoList(JSON.parse(toDoListString) || []);
  }, []);
  useEffect(() => {
    const toDoListJSON = JSON.stringify(toDoList);
    localStorage.setItem("toDoList", toDoListJSON);
  }, [toDoList]);

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
