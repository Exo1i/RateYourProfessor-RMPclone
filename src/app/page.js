'use client'
import ProfessorsDashboard from "@/app/Components/ProfessorDashboard";
import Chat from "@/app/Components/Chat";
import Footer from "@/app/Components/Footer";
import NavigationBar from "@/app/Components/NavigationBar";
import {useEffect, useRef, useState} from "react";
import {getProfessorData} from "@/app/Components/searchRPM";
import updateViewCount from "@/app/Components/UpdateViewCount";

export default function Home() {
    const modalRef = useRef();
    const [selectedProfessor, setSelectedProfessor] = useState(null);
    useEffect(() => {
        if (modalRef.current?.isShown === false) {
            console.log('entered here')
            setSelectedProfessor(null);
        }
    }, [modalRef.current?.isShown])
    const handleProfessorSelect = async (professorId, manuallyAddedTeacherContents = null) => {
            if (professorId === 'manuallyAdded' && manuallyAddedTeacherContents) {
                return;
            } else
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
        }
    ;
    return (<main>
        <NavigationBar handleProfessorSelect={handleProfessorSelect} />
        <ProfessorsDashboard handleProfessorSelect={handleProfessorSelect} modalRef={modalRef}
                             selectedProfessor={selectedProfessor} />
        <Chat />
        <Footer />
    </main>)
}
