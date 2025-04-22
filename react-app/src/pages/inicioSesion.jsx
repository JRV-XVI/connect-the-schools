import React, { useState } from "react";
import NavigationBar from "../components/navigationBar.jsx";
import HeroSection from "../components/heroSection.jsx";
import FeatureSection from "../components/featureSection.jsx";
import RegistrationSection from "../components/registrationSection.jsx";
import RecoveryModal from "../components/recoveryModal.jsx";
import Footer from "../components/footer.jsx";
import '../../styles/inicioSesion.css'; // Corregida la ruta de importación
import LogoMPJ from '../assets/MPJ.png';
import LogoWhite from '../assets/MPJ.png';

const InicioSesion = ({ onLogin }) => {
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  
  const handleCloseModal = () => setShowRecoveryModal(false);
  const handleShowModal = () => setShowRecoveryModal(true);
  
  return (
    <>
      <NavigationBar logo={LogoMPJ} />
      <HeroSection onForgotPassword={handleShowModal} onLogin={onLogin} />
      <FeatureSection />
      <RegistrationSection />
      <RecoveryModal show={showRecoveryModal} onHide={handleCloseModal} />
      <Footer logo={LogoWhite} />
    </>
  );
};

export default InicioSesion;