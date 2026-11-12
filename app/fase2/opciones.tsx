import OptionWheel from '@/app/fase2/OptionWheel';
import '@/styles/fase2/OptionWheel.css';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PasswordModal from '@/app/fase2/password/PasswordModal';

  const ITEMS = [
  'Mary luz',
  'Fernando',
  'Sebastian', 
  'Maria Gladis', 
  'Rosmary Alejandra Peña Ramos', 
  'Daniela', 
  'Danna', 
  'Flor Maria',
  'Wesly', 
  'Fernanda', 
  'Edinson', 
  'Cristian y Jenifer', 
  'Salome y Emmanuel', 
  'Hanna', 
  'Padrino', 
  'Madrina', 
  'Familiares'
];

  // 🔑 Definimos las claves secretas para cada familiar (puedes cambiarlas a tu gusto)
  const CLAVES_FAMILIARES: Record<string, string> = {
  'mary luz' : '230513',
  'fernando' : '1202',
  'sebastian' : '131015',
  'maria gladis' : '1955',
  'rosmary alejandra pena ramos' : '1899', // Nota: 'pena' sin tilde para que coincida con el normalizador
  'daniela' : '1234',
  'danna' : '0405',
  'flor maria' : '2222',
  'wesly' : '1511',
  'fernanda' : '1605',
  'edinson' : '0602',
  'cristian y jenifer' : '6666',
  'salome y emmanuel' : '7777',
  'hanna' : '0000',
  'padrino' : '9999',
  'madrina' : '1000',
  'familiares' : '1212'
};

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


  const handleVerifyPassword = (password: string): boolean => {
    const slugKey = pendingItem.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const claveCorrecta = CLAVES_FAMILIARES[slugKey]; // Clave por defecto si no está en el diccionario

    if (password === claveCorrecta) {
      // Clave exitosa -> Cierra modal y redirige a la ruta dinámica
      setShowModal(false);

      // 🔒 Creamos un pase de acceso temporal para este familiar específico
      sessionStorage.setItem(`auth_${slugKey}`, 'true');

      const slug = slugKey.replace(/\s+/g, '-');
      router.push(`/general/${slug}`);
      return true;
    }
    return false; // Retorna falso para que el modal muestre el error
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