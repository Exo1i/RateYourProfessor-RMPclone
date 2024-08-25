'use client';
import React, {useEffect, useState} from 'react';
import {collection, getDocs, orderBy, query} from "firebase/firestore";
import {getProfessorData} from "@/app/Components/searchRPM";
import Skeleton from "react-loading-skeleton";
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';
import {db} from "@/app/config/firebase";

export default function TopProfessors({onProfessorSelect}) {
    const [topSearched, setTopSearched] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTopSearched = async (displaySkeletonBool) => {
        setLoading(displaySkeletonBool);
        setError(null);
        try {
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
            if (!topSearchedData.length)
                throw new Error("No top searched professors found, Probably a network issue");
            setTopSearched(topSearchedData);
        } catch (error) {
            console.error("Error fetching top searched professors:", error);
            if (error.code === 'unavailable') {
                setError("Unable to connect to the database. Please check your internet connection and try again.");
            } else {
                setError("Failed to fetch professors. Please check your internet connection and try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopSearched(true);
    }, []);

    const getColorClass = (index) => {
        const colors = ["bg-red-200", "bg-green-200", "bg-blue-200", "bg-purple-200", "bg-yellow-200", "bg-pink-200"];
        return colors[index % colors.length];
    };

    return (
        <div className={'mt-3 mb-5'}>
            <h1 className="text-3xl font-bold mb-4 text-center">Top Searched</h1>
            {error && (
                <Alert variant="destructive" className="mb-4 w-[300px] mx-auto">
                    <AlertDescription>{error}</AlertDescription>
                    <Button onClick={() => fetchTopSearched(true)} className="mt-2 w-full">Try Again</Button>
                </Alert>
            )}
            <div className="overflow-y-auto w-[80vw] mb-5 max-h-[300px]">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 w-full px-8 mb-20">
                    {loading ? (
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
                            professor.id ? (
                                <div
                                    key={professor.id}
                                    className={`rounded-lg shadow-lg p-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl cursor-pointer ${getColorClass(index)}`}
                                    onClick={() => {
                                        if (professor.id.includes('manuallyAdded')) onProfessorSelect(professor.id, professor);
                                        else {
                                            onProfessorSelect(professor.id);
                                            fetchTopSearched(false);
                                        }
                                    }}
                                >
                                    <h2 className="text-2xl font-semibold mt-4">{professor.firstName} {professor.lastName}</h2>
                                    <p className="text-gray-500 text-sm">{professor.department} Department</p>
                                    <p className="text-gray-600 text-sm mt-2">Avg. Rating: {professor.avgRating}</p>
                                    <p className="text-gray-600 text-sm mt-1">Avg.
                                                                              Difficulty: {professor.avgDifficulty}</p>
                                </div>
                            ) : null
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}