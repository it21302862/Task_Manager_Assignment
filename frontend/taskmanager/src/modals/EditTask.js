import React, { useState , useEffect} from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const EditTaskPopup = ({modal, toggle, updateTask, taskObj}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errors, setErrors] = useState({ title: '', description: '' });

    const handleChange = (e) => {
        
        const {name, value} = e.target

        if(name === "title"){
            setTitle(value)
            if (value && errors.title) setErrors(prev => ({ ...prev, title: '' }))
        }else{
            setDescription(value)
            if (value && errors.description) setErrors(prev => ({ ...prev, description: '' }))
        }


    }

    useEffect(() => {
        if (modal) {
            setTitle(taskObj.title)
            setDescription(taskObj.description)
            setErrors({ title: '', description: '' })
        }
    },[modal, taskObj])

    const handleUpdate = async (e) => {
        e.preventDefault();
        const nextErrors = {
            title: title.trim() ? '' : 'Title is required',
            description: description.trim() ? '' : 'Description is required',
        };
        setErrors(nextErrors);
        const hasErrors = Object.values(nextErrors).some(Boolean);
        if (hasErrors) return;

        let tempObj = {}
        tempObj['id'] = taskObj.id
        tempObj['title'] = title.trim()
        tempObj['description'] = description.trim()
        await updateTask(tempObj)
        toggle()
    }

    return (
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Update Task</ModalHeader>
            <ModalBody>
            
                    <div className = "form-group">
                        <label>Task Name</label>
                        <input type="text" className = "form-control pretty-input" value = {title} onChange = {handleChange} name = "title"/>
                        {errors.title ? (
                            <div style={{
                                marginTop: '8px',
                                backgroundColor: '#f5636fff',
                                color: '#ffffff',
                                padding: '8px 10px',
                                borderRadius: '6px'
                            }}>
                                {errors.title}
                            </div>
                        ) : null}
                    </div>
                    <div className = "form-group">
                        <label>Description</label>
                        <textarea rows = "5" className = "form-control pretty-input" value = {description} onChange = {handleChange} name = "description"></textarea>
                        {errors.description ? (
                            <div style={{
                                marginTop: '8px',
                                backgroundColor: '#f5636fff',
                                color: '#ffffff',
                                padding: '8px 10px',
                                borderRadius: '6px'
                            }}>
                                {errors.description}
                            </div>
                        ) : null}
                    </div>
                
            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={handleUpdate}>Update</Button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
      </Modal>
    );
};

export default EditTaskPopup;