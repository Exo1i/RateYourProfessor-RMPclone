import React, {forwardRef, Fragment, useEffect, useState} from "react";
import {Dialog, Transition} from "@headlessui/react";
import Skeleton from "react-loading-skeleton";

const Modal = forwardRef(function Modal({selectedProfessor}, ref) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedProfessor) {
            setLoading(false);
        }
    }, [selectedProfessor]);

    const showModal = () => {
        setIsOpen(true);
        setLoading(true);
    };

    const hideModal = () => {
        setIsOpen(false);
        setLoading(false);
    };

    ref.current = {
        showModal, hideModal, isShown: () => isOpen
    };
    // console.log('selectedProfessor:', selectedProfessor);
    return (<Transition appear show={isOpen} as={Fragment}>
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

            <div className="fixed inset-0 overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4 text-center">
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
                            className="w-full max-w-lg h-[80vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <div className="overflow-y-auto h-full">
                                {loading ? <div className="bg-white rounded-lg p-8">
                                    <Skeleton height={30} width="80%" />
                                    <Skeleton height={20} width="60%" className="mt-4" />
                                    <Skeleton height={20} width="60%" className="mt-2" />
                                    <Skeleton height={20} width="40%" className="mt-1" />
                                    <Skeleton height={150} className="mt-4" />
                                    <Skeleton height={20} width="90%" className="mt-2" />
                                    <Skeleton height={20} width="90%" className="mt-2" />
                                </div> : selectedProfessor && (<div>
                                    <Dialog.Title as="h3"
                                                  className="text-2xl font-bold leading-6 text-gray-900">
                                        {selectedProfessor.id.includes('manuallyAdded') ? selectedProfessor.name : `${selectedProfessor.firstName} ${selectedProfessor.lastName}`}
                                    </Dialog.Title>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                            {selectedProfessor.department} Department
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Avg. Rating: {selectedProfessor.avgRating}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Number of Ratings: {selectedProfessor.numRatings}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            School: {selectedProfessor.school.name}, {selectedProfessor.school.city}, {selectedProfessor.school.state}
                                        </p>
                                    </div>
                                    {selectedProfessor.ratings && <div className="mt-4">
                                        <h4 className="text-lg font-bold">Ratings:</h4>
                                        {selectedProfessor.ratings.edges.map(({node}) => (<div key={node.id}
                                                                                               className="bg-gray-100 p-4 mt-4 rounded-lg">
                                            <p><strong>Course:</strong> {node.class}</p>
                                            <p><strong>Rating:</strong> {node.clarityRating}/5</p>
                                            <p><strong>Comment:</strong> {node.comment}</p>
                                            <p>
                                                <strong>Date:</strong> {node.date.slice(0)
                                                .split('T')[0]}
                                            </p>
                                        </div>))}
                                    </div>}
                                </div>)}
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </div>
        </Dialog>
    </Transition>);
});

export default Modal;