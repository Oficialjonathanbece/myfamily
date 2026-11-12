import RotatingText from '@/app/fase2/Title/RotatingText';


export default function Titulo() {
  return (
    <RotatingText
      texts={['FAMILIA', 'DIOS', 'BUENO', 'AGRADECIMIENTO']}
      effect="slide"
      direction="up"
      highlight
      highlightColor="#a855f7"
      staggerFrom="last"
      staggerDuration={0.025}
      splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
      rotationInterval={2000}
      splitBy="characters"
      blur={0}
      auto
      loop
      pauseOnHover={false}
    />
  );
}