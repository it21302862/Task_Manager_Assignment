import React, {useState} from 'react';
import EditTask from '../modals/EditTask'

const Card = ({taskObj, index, deleteTask, completeTask, updateListArray}) => {
    const [modal, setModal] = useState(false);

    const colors = [
        {
            primaryColor : "#5D93E1",
            secondaryColor : "#ECF3FC"
        },
        {
            primaryColor : "#F9D288",
            secondaryColor : "#FEFAF1"
        },
        {
            primaryColor : "#5DC250",
            secondaryColor : "#F2FAF1"
        },
        {
            primaryColor : "#F48687",
            secondaryColor : "#FDF1F1"
        },
        {
            primaryColor : "#B964F7",
            secondaryColor : "#F3F0FD"
        }
    ]

    const toggle = () => {
        setModal(!modal);
    }

    const updateTask = (obj) => {
        updateListArray(obj)
    }

    const handleDelete = () => {
        deleteTask()
    }

    const handleComplete = () => {
        completeTask()
    }

    return (
        <> 
            <div className = "card-wrapper mr-5">
                <div className = "card-top" style={{backgroundColor: colors[index%5].primaryColor}}></div>
                <div className = "task-holder">
                    <span className = "card-header" style={{backgroundColor: colors[index%5].secondaryColor, borderRadius: "10px"}}>{taskObj.title}</span>
                    <p className = "mt-3">{taskObj.description}</p>

                    <div className="card-actions">
                        <button className="btn btn-success btn-sm" onClick={handleComplete}>Done</button>
                        <i className = "far fa-edit action-icon" style={{color : colors[index%5].primaryColor}} onClick = {() => setModal(true)}></i>
                        <i className="fas fa-trash-alt action-icon" style = {{color : colors[index%5].primaryColor}} onClick = {handleDelete}></i>
                    </div>
                </div>
            </div>
            <EditTask modal = {modal} toggle = {toggle} updateTask = {updateTask} taskObj = {taskObj}/>
        </>
    );
};

export default Card;