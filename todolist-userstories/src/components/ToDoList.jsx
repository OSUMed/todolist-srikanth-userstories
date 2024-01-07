import React, { useEffect, useState } from "react";
import ToDoAddForm from "./ToDoAddForm";
import {
  List,
  ListItem,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
  Checkbox,
  ButtonGroup,
  IconButton,
  FormGroup,
  FormControl,
  FormControlLabel,
  Dialog,
  DialogActions,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  Chip,
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import LabelImportantIcon from "@mui/icons-material/LabelImportant";
import PropTypes from "prop-types";

import CloseIcon from "@mui/icons-material/Close";

const ToDoList = () => {
  const [toDoList, setToDoList] = useState([]);
  const [finishedTasks, setFinishedTasks] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [priority, setPriority] = useState("");
  // const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState({
    open: false,
    vertical: "bottom",
    horizontal: "right",
    severity: "info",
  });
  const [task, setTask] = useState("");
  const [error, setError] = useState(false);
  const { vertical, horizontal, open, severity } = openSnackBar;
  const [snackBarMessage, setSnackBarMessage] = useState("");
  const [taskRestored, setTaskRestored] = useState(false);
  const [actionType, setActionType] = useState("");

  // Local Storage Logic:
  useEffect(() => {
    const toDoListString = localStorage.getItem("toDoList");

    setToDoList(JSON.parse(toDoListString) || []);
  }, []);

  useEffect(() => {
    const toDoListJSON = JSON.stringify(toDoList);
    localStorage.setItem("toDoList", toDoListJSON);
  }, [toDoList]);

  const sortTasks = (tasks) => {
    const urgentTasks = tasks.filter((task) => task.priority === "Urgent");
    const mediumTasks = tasks.filter((task) => task.priority === "Medium");
    const lowTasks = tasks.filter((task) => task.priority === "Low");
    const noneTasks = tasks.filter(
      (task) => task.priority === "" || task.priority === "None"
    );

    return [...urgentTasks, ...mediumTasks, ...lowTasks, ...noneTasks];
  };

  // CRUD Logic:

  const getTaskIndex = (taskId) => {
    return toDoList.findIndex((task) => task.id === taskId);
  };
  const handleMoveUpList = (taskId) => {
    const currentIndex = getTaskIndex(taskId);
    if (currentIndex > 0) {
      const reorderedList = [...toDoList];
      const temp = [
        reorderedList[currentIndex],
        reorderedList[currentIndex - 1],
      ];
      reorderedList[currentIndex - 1] = temp[0];
      reorderedList[currentIndex] = temp[1];
      setToDoList(reorderedList);
    }
  };

  const handleMoveDownList = (taskId) => {
    const currentIndex = getTaskIndex(taskId);
    if (currentIndex < toDoList.length - 1) {
      const reorderedList = [...toDoList];
      const temp = [
        reorderedList[currentIndex],
        reorderedList[currentIndex + 1],
      ];
      reorderedList[currentIndex + 1] = temp[0];
      reorderedList[currentIndex] = temp[1];
      setToDoList(reorderedList);
    }
  };

  const updateTaskPriority = (tasks, taskId, newPriority) => {
    // Grab task and update it:
    let updatedTask = null;
    const remainingTasks = tasks.filter((task) => {
      if (task.id === taskId) {
        updatedTask = { ...task, priority: newPriority };
        return false;
      }
      return true;
    });

    // Create Data Strcuture to group tasks by priority
    const priorityGroups = {
      Urgent: [],
      Medium: [],
      Low: [],
      None: [],
    };

    remainingTasks.forEach((task) => {
      const priority = task.priority || "None";
      priorityGroups[priority].push(task);
    });

    // Use spread operator to add it to the front
    if (updatedTask) {
      priorityGroups[newPriority] = [
        updatedTask,
        ...priorityGroups[newPriority],
      ];
    }

    // Update state
    setToDoList([
      ...priorityGroups["Urgent"],
      ...priorityGroups["Medium"],
      ...priorityGroups["Low"],
      ...priorityGroups["None"],
    ]);

    return;
  };

  const isTaskCompleted = (taskId) => finishedTasks.includes(taskId);
  const handleCheckBoxToggle = (taskId) => {
    // if completed task is toggled again, remove it from the finishedTasks array
    if (isTaskCompleted(taskId)) {
      setFinishedTasks((prevFinishedTasks) =>
        prevFinishedTasks.filter((id) => id !== taskId)
      );
      return;
    }
    setFinishedTasks((prevFinishedTasks) => [...prevFinishedTasks, taskId]);
  };

  const handleDeleteDialogOpen = (task) => {
    setOpenDeleteDialog(false);
    setSelectedTask(task);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirmation = (task) => {
    setTaskRestored(false);
    setActionType("delete");
    let taskId = task.id;
    setToDoList((prevToDoList) => {
      return prevToDoList.filter((task) => task.id !== taskId);
    });
    setOpenDeleteDialog(false);
    setOpenSnackBar({ ...openSnackBar, open: true, severity: "success" });
    setSnackBarMessage("Task deleted successfully");
  };
  const handleCloseSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenDeleteDialog(false);
    setSelectedTask("");
    setOpenSnackBar({ ...openSnackBar, open: false });
  };

  const handleRestoreSnackBarDialog = () => {
    setOpenSnackBar({ ...openSnackBar, open: true });
    setToDoList((prevToDoList) => {
      return prevToDoList ? [selectedTask, ...prevToDoList] : [selectedTask];
    });
    setSelectedTask("");
    setTaskRestored(true);
    setActionType("restore");
    setSnackBarMessage("Task restored successfully");
  };

  const action = (
    <React.Fragment>
      {actionType === "delete" ? (
        <>
          <Button
            color="secondary"
            size="small"
            onClick={handleRestoreSnackBarDialog}
          >
            UNDO
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleCloseSnackBar}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      ) : (
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={handleCloseSnackBar}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </React.Fragment>
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!task.trim()) {
      setError(true);
      return;
    }
    const newTaskObject = {
      id: new Date().getTime().toString(),
      taskName: task,
      completed: false,
      priority: "",
    };
    setToDoList((prevToDoList) => {
      return prevToDoList ? [newTaskObject, ...prevToDoList] : [newTaskObject];
    });

    setTask("");
    setError(false);
    setActionType("create");
    setOpenSnackBar({ ...openSnackBar, open: true, severity: "success" });
    setSnackBarMessage("Task added successfully");
  };

  const onPriorityChange = (priority, taskId) => {
    updateTaskPriority(toDoList, taskId, priority);
  };

  return (
    <Box className="h-screen flex flex-col justify-center items-center m-4">
      <Typography variant="h3" className="mb-4">
        To Do List
      </Typography>
      <Card
        className={`w-[60%] mx-auto ${
          toDoList.length === 0 && "h-full"
        } p-4 flex flex-col justify-center`}
      >
        <CardContent>
          <List>
            {toDoList.map((task) => (
              <Box className="group" key={task.id}>
                <ListItem className="group-hover:bg-gray-200 rounded shadow-sm p-2 mb-2 ">
                  <Chip
                    label={task.priority === "" ? "None" : task.priority}
                    color={
                      task.priority === "Urgent"
                        ? "error"
                        : task.priority === "Medium"
                        ? "warning"
                        : task.priority === "Low"
                        ? "primary"
                        : "default"
                    }
                    variant={task.priority === "None" ? "outlined" : "default"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: "4px",
                      left: "4px",
                      zIndex: 1,
                    }}
                  ></Chip>
                  <Box
                    className="flex flex-grow"
                    onClick={() => handleCheckBoxToggle(task.id)}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isTaskCompleted(task.id)}
                            disableRipple
                            onClick={() => handleCheckBoxToggle(task.id)}
                          />
                        }
                        label={
                          <Box className="flex space-x-3">
                            <Typography
                              variant="h6"
                              className={`text-center ${
                                finishedTasks.includes(task.id)
                                  ? "line-through"
                                  : ""
                              }`}
                            >
                              {task.taskName}
                            </Typography>
                          </Box>
                        }
                      />
                    </FormGroup>
                  </Box>

                  <Box className="flex items-center">
                    <Box>
                      <Box className="flex flex-col items-end hidden sm:block">
                        <Box className="flex">
                          <FormControl>
                            <Select
                              labelId="priority-select-label"
                              renderValue={(selected) => {
                                if (selected.length === 0) {
                                  return <em>Placeholder</em>;
                                }
                                return selected;
                              }}
                              displayEmpty
                              autoWidth
                              value={
                                task.priority === "" ? (
                                  "Priority Level"
                                ) : (
                                  <Typography>
                                    <LabelImportantIcon /> {task.priority}
                                  </Typography>
                                )
                              }
                              onChange={(e) =>
                                onPriorityChange(e.target.value, task.id)
                              }
                            >
                              <MenuItem value="None" style={{ color: "gray" }}>
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={"Low"} style={{ color: "blue" }}>
                                Low
                              </MenuItem>
                              <MenuItem
                                value={"Medium"}
                                style={{ color: "orange" }}
                              >
                                Medium
                              </MenuItem>
                              <MenuItem
                                value={"Urgent"}
                                style={{ color: "red" }}
                              >
                                Urgent
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </Box>
                        <Button
                          color="error"
                          variant="outlined"
                          sx={{ m: 1, width: 120, height: 50 }}
                          className="flex flex-row justify-center items-center space-x-2"
                          onClick={() => handleDeleteDialogOpen(task)}
                        >
                          <Typography className="hidden md:block">
                            Delete
                          </Typography>
                          <DeleteIcon />
                        </Button>
                      </Box>
                    </Box>
                    <Box className="h-full flex flex-col">
                      <IconButton
                        className="text-gray-400 hover:text-gray-600 focus:text-gray-600 active:text-gray-800 p-2"
                        onClick={() => handleMoveUpList(task.id)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton
                        className="text-gray-400 hover:text-gray-600 focus:text-gray-600 active:text-gray-800 p-2"
                        onClick={() => handleMoveDownList(task.id)}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </ListItem>
              </Box>
            ))}
          </List>

          <ToDoAddForm
            key={(toDoList.length > 0 && toDoList[0].id) || 0}
            setToDoList={setToDoList}
            setSnackBarMessage={setSnackBarMessage}
            setOpenSnackBar={setSnackBarMessage}
            openSnackBar={openSnackBar}
            setError={setError}
            setTask={setTask}
            error={error}
            handleSubmit={handleSubmit}
          />
        </CardContent>
      </Card>

      <HandleDialogClose
        setOpen={setOpenDeleteDialog}
        open={openDeleteDialog}
        handleClose={handleCloseSnackBar}
        handleDeleteConfirmation={handleDeleteConfirmation}
        task={selectedTask}
      />

      <MessageSnackbar
        anchorOrigin={{ vertical, horizontal }}
        openSnackBar={openSnackBar}
        handleClose={handleCloseSnackBar}
        feedbackMessage={snackBarMessage}
        action={action}
        handleCloseSnackBar={handleCloseSnackBar}
      />
    </Box>
  );
};

const HandleDialogClose = (props) => {
  const { open, handleClose, handleDeleteConfirmation, task } = props;
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete message</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this message? This cannot be undone.
        </DialogContentText>
        <Card variant="outlined" sx={{ margin: 2, padding: 2 }}>
          <Typography variant="body2">{task && task.taskName}</Typography>
        </Card>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ color: "black", border: "1px solid black" }}
        >
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={() => handleDeleteConfirmation(task)}
          startIcon={<DeleteIcon />}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const MessageSnackbar = ({
  openSnackBar,
  handleClose,
  feedbackMessage,
  action,
  handleCloseSnackBarDialog,
  handleCloseSnackBar,
}) => {
  const { open, severity, vertical, horizontal } = openSnackBar;
  return (
    <div>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={severity}
          action={action}
        >
          {feedbackMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ToDoList;
