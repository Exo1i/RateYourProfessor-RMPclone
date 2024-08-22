import Cards from "./Components/Cards";
import Chat from "./Components/Chat";
import Footer from "./Components/Footer";
import NavigationBar from "./Components/NavigationBar";

export default function LandingPage() {
  return (
    <>
      <NavigationBar />
      <Cards />
      <Chat />
      <Footer />
    </>
  );
}
