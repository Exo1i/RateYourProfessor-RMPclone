'use client';
import React from "react";
import 'react-loading-skeleton/dist/skeleton.css';
import TopProfessors from "@/app/Components/TopProfessors";
import Professors from "@/app/Components/Professors";
import Modal from "@/app/Components/Modal";

export default function ProfessorsDashboard({handleProfessorSelect, modalRef, selectedProfessor}) {
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