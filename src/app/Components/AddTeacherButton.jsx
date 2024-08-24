import React, {Fragment, useState} from 'react';
import {Dialog, Transition} from "@headlessui/react";

const AddTeacherButton = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    return (
        <div className={"mt-5"}>
            <button
                onClick={isOpen ? handleClose : handleOpen}
                className="text-white bg-blue-500 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-4"
            >
                Add Teacher
            </button>
            <Modal isOpen={isOpen} handleOpen={handleOpen} handleClose={handleClose} />
        </div>
    );
};

export default AddTeacherButton;

function Modal({isOpen, handleClose}) {
    const [formData, setFormData] = useState({
        id: 'manuallyAdded',
        name: '',
        department: '',
        avgRating: '',
        avgDifficulty: '',
        school: '',
        city: '',
        state: '',
        numRatings: 1
    });

    const hideModal = () => {
        handleClose();
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        fetch('/api/professors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        hideModal();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={hideModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel
                            className="w-full max-w-lg h-auto transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <form onSubmit={handleSubmit}>
                                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                                    Add Teacher
                                </Dialog.Title>

                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-blue-500/50 border-[0.25px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-blue-500/50 border-[0.25px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Avg. Rating</label>
                                    <input
                                        type="number"
                                        name="avgRating"
                                        value={formData.avgRating}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-blue-500/50 border-[0.25px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">Avg. Difficulty</label>
                                    <input
                                        type="number"
                                        name="avgDifficulty"
                                        value={formData.avgDifficulty}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-blue-500/50 border-[0.25px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">School Name</label>
                                    <input
                                        type="text"
                                        name="school"
                                        value={formData.school.name}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-blue-500/50 border-[0.25px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.school.city}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-blue-500/50 border-[0.25px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.school.state}
                                        onChange={handleChange}
                                        className="mt-1 block w-full rounded-md border-blue-500/50 border-[0.25px] shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    />
                                </div>
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-500 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Add Teacher
                                    </button>
                                </div>
                            </form>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
