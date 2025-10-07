import React, {useEffect, useState} from 'react';
import CreateTask from '../modals/createTask';
import Card from './Card';

const TodoList = () => {
    const [modal, setModal] = useState(false);
    const [taskList, setTaskList] = useState([])
    
    useEffect(() => {
        const loadRecentTasks = async () => {
            try {
                const response = await fetch('http://localhost:9090/api/tasks/recent');
                if (!response.ok) {
                    throw new Error('Failed to load tasks');
                }
                const tasks = await response.json();
                // Expecting tasks with fields: id, title, description, completed
                const activeTasks = tasks.filter(t => !t.completed).slice(0, 5);
                setTaskList(activeTasks);
            } catch (error) {
                console.error('Error fetching recent tasks', error);
                setTaskList([]);
            }
        };
        loadRecentTasks();
    }, [])


    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:9090/api/tasks/${taskId}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
            setTaskList(prev => prev.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Error deleting task', error);
        }
    }

    const updateListArray = (updatedTask) => {
        setTaskList(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    }

    const toggle = () => {
        setModal(!modal);
    }

    const saveTask = async (taskObj) => {
        try {
            const response = await fetch('http://localhost:9090/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: taskObj.title, description: taskObj.description })
            });
            if (!response.ok) {
                throw new Error('Failed to create task');
            }
            const created = await response.json();
            if (!created.completed) {
                setTaskList(prev => [created, ...prev].slice(0, 5));
            }
            setModal(false)
        } catch (error) {
            console.error('Error creating task', error);
        }
    }

    const completeTask = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:9090/api/tasks/${taskId}/complete`, {
                method: 'PUT'
            });
            if (!response.ok) {
                throw new Error('Failed to complete task');
            }
            // Hide completed from UI
            setTaskList(prev => prev.filter(t => t.id !== taskId));
        } catch (error) {
            console.error('Error completing task', error);
        }
    }


    return (
        <>
            <div className = "header text-center">
                <h3>Todo List</h3>
                <button className = "btn btn-primary mt-2" onClick = {() => setModal(true)} >Create Task</button>
            </div>
            <div className = "task-container">
            {taskList && taskList.map((obj , index) => (
                <Card 
                    key={obj.id}
                    taskObj={obj} 
                    index={index} 
                    deleteTask={() => deleteTask(obj.id)} 
                    completeTask={() => completeTask(obj.id)} 
                    updateListArray={updateListArray}
                />
            ))}
            </div>
            <CreateTask toggle = {toggle} modal = {modal} save = {saveTask}/>
        </>
    );
};

export default TodoList;