// src/CodeSnap.js
import React, { useRef, useState, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';

// Importaciones de Prism.js
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Tema oscuro
// Importa los componentes de lenguajes
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup'; // Para HTML

const CodeSnap = () => {
  const [code, setCode] = useState('function hello() {\n  console.log("Hello World!");\n}');
  const [language, setLanguage] = useState('javascript');
  const previewRef = useRef(null);

  // Efecto para resaltar la sintaxis
  useEffect(() => {
    Prism.highlightAll();
  }, [code, language]);

  const handleDownload = async () => {
    if (previewRef.current === null) {
      return;
    }

    // Pequeña pausa para asegurar que el resaltado se aplique
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      const dataUrl = await toPng(previewRef.current, { 
        quality: 0.95,
        backgroundColor: '#2d2d2d' // Fondo oscuro para coincidir con el tema
      });
      
      const link = document.createElement('a');
      link.download = 'code-snap.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error al generar la imagen:', error);
    }
  };

  return (
    <div className="app-container">
      {/* Panel de Control (Izquierda) */}
      <div className="controls">
        <h2>Configuración</h2>
        <label>
          Lenguaje:
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="jsx">JSX</option>
            <option value="markup">Markup</option>
          </select>
        </label>
        <br />
        <label>
          Tu Código:
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="10"
            cols="50"
            spellCheck="false"
          />
        </label>
        <br />
        <button onClick={handleDownload}>
          <Download size={16} />
          Descargar PNG
        </button>
      </div>

      {/* Vista Previa (Derecha) */}
      <div className="preview">
        <h2>Vista Previa</h2>
        <div ref={previewRef} className="code-preview">
          <pre className={`language-${language}`}>
            <code className={`language-${language}`}>
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeSnap;