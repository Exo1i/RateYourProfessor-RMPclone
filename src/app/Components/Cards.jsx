'use client';
import {Fragment, useEffect, useState} from "react";
import {getProfessorData} from "@/app/Components/searchRPM";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {Dialog, Transition} from '@headlessui/react';
import {collection, doc, getDoc, getDocs, orderBy, query, setDoc} from "firebase/firestore";
import {db} from "@/app/config/firebase";

export default function ProfessorsDashboard() {
    const [professors, setProfessors] = useState([]);
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [topSearched, setTopSearched] = useState([]);
    const [loadingTopSearched, setLoadingTopSearched] = useState(true);

    const fetchTopSearched = async () => {
        const q = query(collection(db, "topSearched"), orderBy("clicks", "desc"));
        const querySnapshot = await getDocs(q);
        const sortedTopSearched = querySnapshot.docs.map(doc => doc.data());

        const topSearchedData = [];
        for (const professor of sortedTopSearched) {
            try {
                const response = await getProfessorData(professor.id);
                topSearchedData.push({...response.data.node});
            } catch (error) {
                console.error("Error fetching professor details:", error);
            }
        }
        setTopSearched(topSearchedData);
        setLoadingTopSearched(false);
    };

    useEffect(() => {
        const fetchProfessors = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/professors');
                const data = await response.json();
                setProfessors(data);
            } catch (error) {
                console.error('Error fetching professors:', error);
            } finally {
                setLoading(false);
            }
        };


        fetchProfessors();
        fetchTopSearched();
    }, []);

    const openModal = async (teacherId) => {
        setLoading(true);
        try {
            const response = await getProfessorData(teacherId);
            setSelectedProfessor(response.data.node);
            updateClickCount(teacherId);
            setIsModalOpen(true);
        } catch (error) {
            console.error("Error fetching professor details:", error);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProfessor(null);
    };

    const updateClickCount = async (professorId) => {
        const docRef = doc(db, "topSearched", professorId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await setDoc(docRef, {clicks: docSnap.data().clicks + 1}, {merge: true});
        } else {
            await setDoc(docRef, {id: professorId, clicks: 1});
        }

        fetchTopSearched();
    };

    const getColorClass = (index) => {
        const colors = ["bg-red-200", "bg-green-200", "bg-blue-200", "bg-purple-200", "bg-yellow-200", "bg-pink-200"];
        const seed = index % colors.length;
        return colors[seed];
    };

    const isContentLoading = loading || loadingTopSearched;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-100">

            {/* Top Searched Section */}
            <div className="w-full px-8 mb-20">
                <h2 className="text-3xl font-bold mb-4 text-center">Top Searched</h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {loadingTopSearched ? (
                        Array(3).fill().map((_, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                                <Skeleton height={150} />
                                <Skeleton height={30} width="80%" className="mt-4" />
                                <Skeleton height={20} width="60%" className="mt-2" />
                                <Skeleton height={20} width="40%" className="mt-1" />
                            </div>
                        ))
                    ) : (
                        topSearched.map((professor, index) => (
                            <div
                                key={professor.id}
                                className={`rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${getColorClass(index)}`}
                                onClick={() => openModal(professor.id)}
                            >
                                <h2 className="text-2xl font-semibold mt-4">{professor.firstName} {professor.lastName}</h2>
                                <p className="text-gray-500 text-sm">{professor.department} Department</p>
                                <p className="text-gray-600 text-sm mt-2">Avg. Rating: {professor.avgRating}</p>
                                <p className="text-gray-600 text-sm mt-1">Avg. Difficulty: {professor.avgDifficulty}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold mb-8 text-center">Professors</h1>

            {/* Professors Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 w-full px-8 mb-20">
                {loading ? (
                    Array(6).fill().map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-4">
                            <Skeleton height={150} />
                            <Skeleton height={30} width="80%" className="mt-4" />
                            <Skeleton height={20} width="60%" className="mt-2" />
                            <Skeleton height={20} width="40%" className="mt-1" />
                        </div>
                    ))
                ) : (
                    professors.map(professor => (
                        <div
                            key={professor.metadata.id}
                            className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                            onClick={() => openModal(professor.metadata.id)}
                        >
                            <h2 className="text-2xl font-semibold mt-4">{professor.metadata.name}</h2>
                            <p className="text-gray-500 text-sm">{professor.metadata.department} Department</p>
                            <p className="text-gray-600 text-sm mt-2">Avg. Rating: {professor.metadata.avgRating}</p>
                            <p className="text-gray-600 text-sm mt-1">Avg.
                                                                      Difficulty: {professor.metadata.avgDifficulty}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                                        {loading ? (
                                            <div className="bg-white rounded-lg p-8">
                                                <Skeleton height={30} width="80%" />
                                                <Skeleton height={20} width="60%" className="mt-4" />
                                                <Skeleton height={20} width="60%" className="mt-2" />
                                                <Skeleton height={20} width="40%" className="mt-1" />
                                                <Skeleton height={150} className="mt-4" />
                                                <Skeleton height={20} width="90%" className="mt-2" />
                                                <Skeleton height={20} width="90%" className="mt-2" />
                                            </div>
                                        ) : (
                                            selectedProfessor && (
                                                <div>
                                                    <Dialog.Title as="h3"
                                                                  className="text-2xl font-bold leading-6 text-gray-900">
                                                        {selectedProfessor.firstName} {selectedProfessor.lastName}
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

                                                    <div className="mt-4">
                                                        <h4 className="text-lg font-bold">Ratings:</h4>
                                                        {selectedProfessor.ratings.edges.map(({node}) => (
                                                            <div key={node.id}
                                                                 className="bg-gray-100 p-4 mt-4 rounded-lg">
                                                                <p><strong>Course:</strong> {node.class}</p>
                                                                <p><strong>Rating:</strong> {node.clarityRating}/5</p>
                                                                <p><strong>Comment:</strong> {node.comment}</p>
                                                                <p>
                                                                    <strong>Date:</strong> {node.date.slice(0)
                                                                    .split('T')[0]}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
