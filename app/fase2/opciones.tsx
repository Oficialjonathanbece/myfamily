import OptionWheel from '@/app/fase2/OptionWheel';
import '@/styles/fase2/OptionWheel.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordModal from '@/app/fase2/password/PasswordModal';
import { apiService } from '@/services/api'; // 👈 Importamos el servicio centralizado hacia FastAPI

  const ITEMS = [
  'Sebastian "The Best Friend in the world" ',  

  'Maria Gladis', 
  'Mary luz Becerra',


  'Fernando Rodriguez',
  'Luis David Macuare', 
  'Mileida Ortiz',

   

  'Flor Maria',  

  'Daniela Giraldo',
  'David esposo de daniela', 

  'Danna Giraldo', 
  'Brayan esposo de danna',
  'Salome y Emmanuel',

  'Fernanda Becerra',
  'Wesly', 
  'Jesus esposo de fernanda',

  'Edinson Viera', 
  'Cristian y Jenifer', 
    
  'Padrino', 
  'Madrina',

  'Yese',
  'Shelsy Sofia',  

  'Oscar Humberto Aristizabal',


  'Rosmary Alejandra Peña Ramos', 
  'Familiares'
];



export default function Opciones({ onSelect }: { onSelect?: (index: number, item: string) => void }) {
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(2);

  // Estados para manejar el modal
  const [showModal, setShowModal] = useState(false);
  const [pendingItem, setPendingItem] = useState('');

  const handleSelect = (index: number, item: string) => {
    // Si la persona vuelve a tocar el ítem que ya está en el centro, navega
    if (index === selectedIdx) {
      // SEGUNDO TOQUE: Abre el modal limpio
      setPendingItem(item);
      setShowModal(true);

      } else {
      // PRIMER TOQUE: Centra el elemento en la rueda
      setSelectedIdx(index);
    }
  };


 // Validación de contraseña conectada al backend de FastAPI
  const handleVerifyPassword = async (password: string): Promise<boolean> => {
    try {
      const slugKey = pendingItem.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const slug = slugKey.replace(/\s+/g, '-');

      // Consultamos al servidor de FastAPI si la clave es correcta para este slug
      await apiService.loginProfile(slug, password);

      // Si el servidor responde 200 OK:
      setShowModal(false);

      // Creamos el pase de acceso temporal en el navegador
      sessionStorage.setItem(`auth_${slug}`, 'true');

      // Redirigimos a la ruta dinámica protegida
      router.push(`/general/${slug}`);
      return true;
    } catch (err) {
      // Si el servidor retorna error (401 o 404), la clave es incorrecta
      return false; 
    }
  };

 return (
    <>
      {/* La rueda se renderiza limpia sin divs extra molestos */}
      <OptionWheel
        items={ITEMS}
        defaultSelected={selectedIdx}
        textColor="#a6a6a6"
        activeColor="#ffffff"
        side="left"
        fontSize={2.2}
        spacing={1.4}
        curve={1}
        tilt={6}
        blur={2}
        fade={0.25}
        smoothing={200}
        inset={50}
        loop={false}
        draggable
        soundUrl="/assets/sounds/click-soft.mp3"
        soundVolume={0.5}
        onChange={handleSelect}
      />

      {/* El modal de contraseña vive aparte, protegido por un portal o position fixed */}
      <PasswordModal
        isOpen={showModal}
        itemName={pendingItem}
        onClose={() => setShowModal(false)}
        onSubmitPassword={handleVerifyPassword}
      />
    </>
  );
}