import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TextTypeProps {
  texts: string[];
}

const TextType: React.FC<TextTypeProps> = ({ texts }) => {
  const [currentText, setCurrentText] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="inline-block">
      <motion.div
        key={currentText}
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: '0%', opacity: 1 }}
        exit={{ y: '-100%', opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
      >
        {texts[currentText]}
      </motion.div>
    </div>
  );
};

export default TextType;
