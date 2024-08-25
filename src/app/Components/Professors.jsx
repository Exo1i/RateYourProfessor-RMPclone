// Professors.js
'use client';
import React, {useEffect, useState} from 'react';
import Skeleton from "react-loading-skeleton";
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';

const Professors = function Professors({onProfessorSelect}) {
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfessors = async (displaySkeleton) => {
        try {
            setLoading(displaySkeleton);
            setError(null);
            const response = await fetch('/api/professors');
            if (!response.ok) {
                throw new Error('Failed to fetch professors');
            }
            const data = await response.json();
            setProfessors(data);
        } catch (error) {
            console.error('Error fetching professors:', error);
            setError("Failed to fetch professors. Please check your internet connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfessors(true);
    }, []);

    return (
        <>
            <h1 className="text-4xl font-bold mb-8 text-center">Professors</h1>

            {error && (
                <Alert variant="destructive" className="mb-4 w-[300px] mx-auto">
                    <AlertDescription>{error}</AlertDescription>
                    <Button onClick={() => fetchProfessors(true)} className="mt-2 w-full">Try Again</Button>
                </Alert>
            )}

            <div className="overflow-y-auto w-[80vw] max-h-[300px]">
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
                            professor.metadata ? (
                                <div
                                    key={professor.metadata.id}
                                    className="bg-white rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                                    onClick={() => {
                                        if (professor.metadata.id.includes('manuallyAdded')) onProfessorSelect(professor.metadata.id, professor.metadata)
                                        else
                                            onProfessorSelect(professor.metadata.id)
                                    }}
                                >
                                    <h2 className="text-2xl font-semibold mt-4">{professor.metadata.name}</h2>
                                    <p className="text-gray-500 text-sm">{professor.metadata.department} Department</p>
                                    <p className="text-gray-600 text-sm mt-2">Avg.
                                                                              Rating: {professor.metadata.avgRating}</p>
                                    <p className="text-gray-600 text-sm mt-1">Avg.
                                                                              Difficulty: {professor.metadata.avgDifficulty}</p>
                                </div>
                            ) : null
                        ))
                    )}
                </div>
            </div>
        </>
    );
};
export default Professors;