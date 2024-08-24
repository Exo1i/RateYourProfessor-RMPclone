import ProfessorsDashboard from "@/app/Components/ProfessorDashboard";
import Chat from "@/app/Components/Chat";
import Footer from "@/app/Components/Footer";
import NavigationBar from "@/app/Components/NavigationBar";

export default function Home() {
    return (<main>
        <NavigationBar />
        <ProfessorsDashboard />
        <Chat />
        <Footer />
    </main>)
}
