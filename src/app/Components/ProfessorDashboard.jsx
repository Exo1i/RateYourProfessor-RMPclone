'use client';
import React, {useRef, useState} from "react";
import 'react-loading-skeleton/dist/skeleton.css';
import TopProfessors from "@/app/Components/TopProfessors";
import Professors from "@/app/Components/Professors";
import Modal from "@/app/Components/Modal";
import updateViewCount from "@/app/Components/UpdateViewCount";
import {getProfessorData} from "@/app/Components/searchRPM";

export default function ProfessorsDashboard() {
    const modalRef = useRef();
    const [selectedProfessor, setSelectedProfessor] = useState(null);

    const handleProfessorSelect = async (professorId) => {
        try {
            console.log(professorId)
            const response = await getProfessorData(professorId);
            console.log(response)
            setSelectedProfessor(response.data.node);
            updateViewCount(professorId);
            modalRef.current.showModal();
        } catch (error) {
            console.error("Error fetching professor details:", error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-20 bg-gray-100">
            <TopProfessors
                onProfessorSelect={handleProfessorSelect}
            />

            <Professors
                onProfessorSelect={handleProfessorSelect}
            />

            <Modal ref={modalRef} selectedProfessor={selectedProfessor} />
        </div>
    );
}