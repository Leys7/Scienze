import React, { useState, useEffect, useRef } from 'react';
import { TrainFront, Car, Shield, Clock, MapPin, CheckCircle2, ArrowRight, Play, RotateCcw, AlertCircle, Info } from 'lucide-react';

const INCONTRO_DATA = {
  v1: 30, // m/s (108 km/h)
  v2: 45, // m/s (162 km/h)
  distanza: 20000, // m
  t_meet: 266.67, // s (20000 / 75)
  x_meet: 8000, // m (30 * 266.67)
};

const INSEGUIMENTO_DATA = {
  vLadro: 20, // m/s
  vPolizia: 30, // m/s
  vantaggio: 1000, // m
  t_meet: 100, // s (1000 / 10)
  x_meet: 3000, // m (30 * 100)
};

export default function CinematicaApp() {
  const [activeTab, setActiveTab] = useState('incontro');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-indigo-200">
      {/* Header */}
      <header className="bg-indigo-600 text-white p-6 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <MapPin className="w-8 h-8 text-yellow-300" />
              Cinematica Facile
            </h1>
            <p className="text-indigo-100 mt-1 font-medium text-lg">Il trucco segreto per risolvere i problemi di moto!</p>
          </div>
          
          {/* Tabs */}
          <div className="flex bg-indigo-700 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('incontro')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'incontro' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
            >
              Scontro tra Treni
            </button>
            <button
              onClick={() => setActiveTab('inseguimento')}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                activeTab === 'inseguimento' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-indigo-100 hover:bg-indigo-600'
              }`}
            >
              Guardie e Ladri
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto p-4 md:p-6 pb-20">
        {activeTab === 'incontro' ? <IncontroView /> : <InseguimentoView />}
      </main>
    </div>
  );
}

function IncontroView() {
  const [step, setStep] = useState(1);
  const [animTime, setAnimTime] = useState(0); // da 0 a t_meet
  const [isAnimating, setIsAnimating] = useState(false);
  const reqRef = useRef(null);

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimTime(0);
    const duration = 5000; // 5 secondi reali di animazione fluida
    let startTimestamp = null;

    const stepAnim = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Rimosso l'easing: nel moto rettilineo uniforme la velocità è costante (lineare)
      setAnimTime(progress * INCONTRO_DATA.t_meet);

      if (progress < 1) {
        reqRef.current = requestAnimationFrame(stepAnim);
      } else {
        setIsAnimating(false);
      }
    };
    reqRef.current = requestAnimationFrame(stepAnim);
  };

  const resetAnimation = () => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    setIsAnimating(false);
    setAnimTime(0);
    setStep(1);
  };

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  /* Calcoli Posizioni in Tempo Reale per l'animazione */
  const posTreno1 = INCONTRO_DATA.v1 * animTime; // m
  const posTreno2 = INCONTRO_DATA.distanza - (INCONTRO_DATA.v2 * animTime); // m
  
  // Percentuali per CSS (sulla base di 20000m totali)
  const pctTreno1 = (posTreno1 / INCONTRO_DATA.distanza) * 100;
  const pctTreno2 = (posTreno2 / INCONTRO_DATA.distanza) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      
      {/* Intestazione Problema */}
      <div className="bg-blue-50 p-6 border-b border-blue-100 flex gap-4 items-start">
        <Info className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-2xl font-bold text-blue-900 mb-2">Il Problema dell'Incontro</h2>
          <p className="text-blue-800 text-lg">
            Due treni distano <strong>20 km (20.000 m)</strong> e viaggiano su binari paralleli l'uno verso l'altro. 
            Il Treno A viaggia a <strong>108 km/h (30 m/s)</strong>, il Treno B a <strong>162 km/h (45 m/s)</strong>.
            <em> Dopo quanto tempo si incontreranno?</em>
          </p>
        </div>
      </div>

      {/* Area Animazione Visiva */}
      <div className="p-8 bg-slate-50 relative border-b border-slate-200">
        <div className="flex justify-between text-sm font-bold text-slate-500 mb-2">
          <span>0 m</span>
          <span>Incontro a: {Math.round(INCONTRO_DATA.x_meet)} m</span>
          <span>20.000 m</span>
        </div>
        
        {/* Binario */}
        <div className="relative h-12 bg-slate-300 rounded-full w-full flex items-center px-2 shadow-inner border border-slate-400">
          {/* Treno 1 */}
          <div 
            className="absolute z-10 flex flex-col items-center transition-all ease-linear"
            style={{ left: `calc(${pctTreno1}% - 24px)` }}
          >
            <div className="bg-blue-500 text-white p-2 rounded-lg shadow-lg">
              <TrainFront size={24} />
            </div>
            <span className="text-xs font-bold text-blue-600 mt-1">{Math.round(posTreno1)}m</span>
          </div>

          {/* Marker di incontro (visibile alla fine) */}
          {animTime >= INCONTRO_DATA.t_meet - 1 && (
            <div 
              className="absolute z-0 w-2 h-16 bg-red-500 rounded-full animate-pulse"
              style={{ left: '40%' /* 8000/20000 = 40% */, top: '-8px' }}
            >
            </div>
          )}

          {/* Treno 2 */}
          <div 
            className="absolute z-10 flex flex-col items-center transition-all ease-linear"
            style={{ left: `calc(${pctTreno2}% - 24px)` }}
          >
            <div className="bg-orange-500 text-white p-2 rounded-lg shadow-lg">
              <TrainFront size={24} />
            </div>
            <span className="text-xs font-bold text-orange-600 mt-1">{Math.round(posTreno2)}m</span>
          </div>
        </div>

        {/* Cronometro */}
        <div className="mt-8 flex justify-center items-center gap-3 bg-white w-fit mx-auto px-6 py-3 rounded-2xl shadow-sm border border-slate-200 text-xl font-mono font-bold text-slate-700">
          <Clock className="text-indigo-500" />
          Tempo trascorso: <span className="text-indigo-600 text-2xl">{animTime.toFixed(1)} s</span>
        </div>
      </div>

      {/* STEP MAGICI - Il Cuore Didattico */}
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-green-500" /> 
          Come si risolve? (Il trucco delle incognite)
        </h3>

        {/* Timeline degli Step */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {[1, 2, 3, 4].map((num) => (
            <button 
              key={num}
              onClick={() => { if(!isAnimating) setStep(num); }}
              className={`flex-1 p-3 rounded-xl border-2 text-left transition-all font-semibold ${
                step === num 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-md transform scale-105' 
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Step {num}
            </button>
          ))}
        </div>

        {/* Contenuto dello Step Attivo */}
        <div className="min-h-[250px] bg-indigo-50 rounded-2xl p-6 border border-indigo-100 flex flex-col justify-center">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-indigo-900 mb-4">Il problema iniziale: 4 Incognite!</h4>
              <p className="text-slate-700 mb-6 text-lg">
                Ogni treno ha la sua legge oraria ($S = V \cdot T$). All'inizio sembra impossibile perché non conosciamo né lo spazio né il tempo di nessuno dei due!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <VarCard name="S1" label="Spazio Treno 1" color="bg-blue-100 text-blue-800" />
                <VarCard name="T1" label="Tempo Treno 1" color="bg-blue-100 text-blue-800" />
                <div className="w-4 flex items-center justify-center font-bold text-slate-400">?</div>
                <VarCard name="S2" label="Spazio Treno 2" color="bg-orange-100 text-orange-800" />
                <VarCard name="T2" label="Tempo Treno 2" color="bg-orange-100 text-orange-800" />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-indigo-900 mb-4">Prima Magia: Il tempo è in comune!</h4>
              <p className="text-slate-700 mb-6 text-lg">
                I treni partono e si scontrano <strong>nello stesso identico momento</strong>! Non serve avere due tempi diversi. 
                $T_1$ e $T_2$ diventano una sola lettera: <strong className="text-red-600 text-xl">t</strong>.
              </p>
              <div className="flex justify-center gap-6 items-center">
                <div className="flex flex-col gap-2">
                  <VarCard name="T1" color="bg-blue-100 text-blue-400 line-through" />
                  <VarCard name="T2" color="bg-orange-100 text-orange-400 line-through" />
                </div>
                <ArrowRight className="w-8 h-8 text-slate-400" />
                <div className="transform scale-125">
                  <VarCard name="t" label="TEMPO UNICO" color="bg-red-100 text-red-700 border-2 border-red-400 shadow-lg" />
                </div>
              </div>
              <p className="mt-4 text-green-700 font-bold">Boom! Siamo passati da 4 a 3 incognite.</p>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-indigo-900 mb-4">Seconda Magia: Il punto di incontro</h4>
              <p className="text-slate-700 mb-6 text-lg">
                Fissiamo la partenza del Treno 1 a zero. Lo spazio che percorre lo chiamiamo <strong className="text-blue-600 text-xl">x</strong>.<br/>
                Il Treno 2, invece, parte dal fondo (20.000m) e "torna indietro". La sua posizione sarà: <strong>20.000 - SpazioPercorso</strong>.
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                  <h5 className="font-bold text-blue-800 mb-2">TRENO 1 (Parte da 0)</h5>
                  <p className="font-mono text-xl text-center bg-blue-50 py-2 rounded">x = 30 · t</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-orange-500">
                  <h5 className="font-bold text-orange-800 mb-2">TRENO 2 (Parte da 20.000)</h5>
                  <p className="font-mono text-xl text-center bg-orange-50 py-2 rounded">x = 20000 - 45 · t</p>
                </div>
              </div>
              <p className="mt-4 text-green-700 font-bold">Ora abbiamo solo 2 lettere! La <span className="text-blue-600">x</span> e la <span className="text-red-600">t</span>.</p>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-indigo-900 mb-4">Il Sistema Finale</h4>
              <p className="text-slate-700 mb-4 text-lg">
                Mettiamo a sistema le due equazioni. Visto che la $x$ è uguale per entrambi nel punto di incontro, possiamo eguagliare le due formule!
              </p>
              <div className="bg-white p-6 rounded-2xl shadow-inner max-w-lg mx-auto mb-6 text-2xl font-mono">
                <div className="flex items-center justify-center gap-4 text-slate-800">
                  <span className="text-blue-600 font-bold">30t</span> 
                  <span>=</span> 
                  <span className="text-orange-600 font-bold">20000 - 45t</span>
                </div>
                <div className="text-base text-slate-500 mt-2 font-sans border-t pt-2">
                  75t = 20000 &nbsp; ➡️ &nbsp; <strong className="text-red-600">t = 266.6 s</strong>
                </div>
              </div>
              
              {!isAnimating && animTime === 0 && (
                <button 
                  onClick={startAnimation}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-3 px-8 rounded-full shadow-lg shadow-green-200 transform transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Play fill="currentColor" /> Risolvi e Anima!
                </button>
              )}
              {animTime > 0 && !isAnimating && (
                <button 
                  onClick={resetAnimation}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 mx-auto"
                >
                  <RotateCcw /> Ripeti Simbolo
                </button>
              )}
            </div>
          )}

        </div>
        
        {/* Navigazione tra Step */}
        <div className="flex justify-between mt-6">
          <button 
            disabled={step === 1 || isAnimating}
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-2 text-indigo-600 font-bold disabled:opacity-30"
          >
            Indietro
          </button>
          <button 
            disabled={step === 4 || isAnimating}
            onClick={() => setStep(s => s + 1)}
            className="px-6 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold rounded-lg disabled:opacity-30 transition-colors"
          >
            Avanti
          </button>
        </div>

      </div>
    </div>
  );
}

function InseguimentoView() {
  const [step, setStep] = useState(1);
  const [animTime, setAnimTime] = useState(0); 
  const [isAnimating, setIsAnimating] = useState(false);
  const reqRef = useRef(null);

  const startAnimation = () => {
    setIsAnimating(true);
    setAnimTime(0);
    const duration = 5000; // 5 secondi reali di animazione fluida
    let startTimestamp = null;

    const stepAnim = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Movimento lineare costante
      setAnimTime(progress * INSEGUIMENTO_DATA.t_meet);

      if (progress < 1) {
        reqRef.current = requestAnimationFrame(stepAnim);
      } else {
        setIsAnimating(false);
      }
    };
    reqRef.current = requestAnimationFrame(stepAnim);
  };

  const resetAnimation = () => {
    if (reqRef.current) cancelAnimationFrame(reqRef.current);
    setIsAnimating(false);
    setAnimTime(0);
    setStep(1);
  };

  useEffect(() => {
    return () => {
      if (reqRef.current) cancelAnimationFrame(reqRef.current);
    };
  }, []);

  // Per rendere graficamente bene l'inseguimento, impostiamo la fine pista un po' oltre l'incontro
  const trackLength = 3500; 
  
  const posPolizia = INSEGUIMENTO_DATA.vPolizia * animTime;
  const posLadro = INSEGUIMENTO_DATA.vantaggio + (INSEGUIMENTO_DATA.vLadro * animTime);
  
  const pctPolizia = (posPolizia / trackLength) * 100;
  const pctLadro = (posLadro / trackLength) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      
      <div className="bg-emerald-50 p-6 border-b border-emerald-100 flex gap-4 items-start">
        <AlertCircle className="w-8 h-8 text-emerald-600 flex-shrink-0 mt-1" />
        <div>
          <h2 className="text-2xl font-bold text-emerald-900 mb-2">Il Problema dell'Inseguimento</h2>
          <p className="text-emerald-800 text-lg">
            Un ladro ha un vantaggio di <strong>1.000 metri</strong> e scappa a <strong>20 m/s (72 km/h)</strong>. 
            La polizia lo insegue partendo da 0 a <strong>30 m/s (108 km/h)</strong>.
            <em> Dopo quanto tempo lo prenderanno?</em>
          </p>
        </div>
      </div>

      {/* Visual Track */}
      <div className="p-8 bg-slate-800 relative border-b border-slate-700">
        <div className="flex justify-between text-sm font-bold text-slate-400 mb-2">
          <span>Partenza Polizia (0 m)</span>
          <span>Cattura: {INSEGUIMENTO_DATA.x_meet} m</span>
          <span>Fine Strada ({trackLength} m)</span>
        </div>
        
        <div className="relative h-20 bg-slate-700 rounded-lg w-full flex items-center shadow-inner border-y border-dashed border-slate-500">
          {/* Polizia */}
          <div 
            className="absolute z-20 flex flex-col items-center transition-all ease-linear bottom-2"
            style={{ left: `calc(${pctPolizia}% - 24px)` }}
          >
            <div className="bg-blue-600 text-white p-2 rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.6)] border border-blue-400">
              <Shield size={24} />
            </div>
            <span className="text-xs font-bold text-blue-300 mt-1 absolute -bottom-5">{Math.round(posPolizia)}m</span>
          </div>

          {/* Ladro (Start advantage marker) */}
          <div className="absolute h-full w-1 border-l-2 border-slate-500 opacity-50" style={{left: `${(1000/trackLength)*100}%`}}>
            <span className="absolute -top-6 text-xs text-slate-400 w-24 -ml-10 text-center">Vantaggio 1000m</span>
          </div>

          {/* Cattura Marker */}
          {animTime >= INSEGUIMENTO_DATA.t_meet - 1 && (
            <div 
              className="absolute z-0 w-8 h-8 rounded-full border-4 border-red-500 animate-ping"
              style={{ left: `calc(${(3000/trackLength)*100}% - 16px)`}}
            />
          )}

          {/* Ladro */}
          <div 
            className="absolute z-10 flex flex-col items-center transition-all ease-linear top-2"
            style={{ left: `calc(${pctLadro}% - 20px)` }}
          >
            <div className="bg-slate-900 text-red-500 p-2 rounded-xl border border-red-900">
              <Car size={20} />
            </div>
            <span className="text-xs font-bold text-red-400 mt-1 absolute -top-5">{Math.round(posLadro)}m</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center items-center gap-3 bg-slate-900 w-fit mx-auto px-6 py-3 rounded-2xl border border-slate-700 text-xl font-mono font-bold text-white">
          <Clock className="text-emerald-400" />
          Tempo: <span className="text-emerald-400 text-2xl">{animTime.toFixed(1)} s</span>
        </div>
      </div>

      {}
      <div className="p-6 md:p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-emerald-500" /> 
          La Logica è Identica!
        </h3>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {[1, 2, 3, 4].map((num) => (
            <button 
              key={num}
              onClick={() => { if(!isAnimating) setStep(num); }}
              className={`flex-1 p-3 rounded-xl border-2 text-left transition-all font-semibold ${
                step === num 
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-md transform scale-105' 
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Step {num}
            </button>
          ))}
        </div>

        <div className="min-h-[250px] bg-emerald-50 rounded-2xl p-6 border border-emerald-100 flex flex-col justify-center">
          
          {step === 1 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-emerald-900 mb-4">Stesso problema: Troppe Variabili!</h4>
              <p className="text-slate-700 mb-6 text-lg">
                Come prima, abbiamo la sensazione di avere 4 cose che non sappiamo. Spazio Polizia, Tempo Polizia, Spazio Ladro, Tempo Ladro.
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <VarCard name="Sp" label="Spazio Polizia" color="bg-blue-100 text-blue-800" />
                <VarCard name="Tp" label="Tempo Polizia" color="bg-blue-100 text-blue-800" />
                <div className="w-4 flex items-center justify-center font-bold text-slate-400">?</div>
                <VarCard name="Sl" label="Spazio Ladro" color="bg-slate-200 text-slate-800" />
                <VarCard name="Tl" label="Tempo Ladro" color="bg-slate-200 text-slate-800" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-emerald-900 mb-4">Il Tempo Trascorre per Entrambi</h4>
              <p className="text-slate-700 mb-6 text-lg">
                Il cronometro parte quando inizia l'inseguimento. Il tempo in cui la polizia corre è uguale al tempo in cui il ladro scappa. 
                Quindi, un solo Tempo <strong className="text-red-600 text-xl">t</strong>!
              </p>
              <div className="flex justify-center items-center">
                <VarCard name="t" label="TEMPO DELL'INSEGUIMENTO" color="bg-red-100 text-red-700 border-2 border-red-400 shadow-lg px-8 py-4" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-emerald-900 mb-4">Gestire il Vantaggio</h4>
              <p className="text-slate-700 mb-6 text-lg">
                La polizia parte da zero: <strong className="text-blue-700">x = 30 · t</strong>.<br/>
                Il ladro fa esattamente come la polizia ($Spazio = V \cdot t$), ma <strong>ha un bonus di 1000 metri in partenza!</strong>
              </p>
              <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-600">
                  <h5 className="font-bold text-blue-900 mb-2">POLIZIA (No Vantaggio)</h5>
                  <p className="font-mono text-xl text-center bg-blue-50 py-2 rounded">x = 30 · t</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-slate-700">
                  <h5 className="font-bold text-slate-800 mb-2">LADRO (+1000m Vantaggio)</h5>
                  <p className="font-mono text-xl text-center bg-slate-100 py-2 rounded">x = 20 · t + 1000</p>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in text-center">
              <h4 className="text-2xl font-bold text-emerald-900 mb-4">Eguagliamo gli spazi (Preso!)</h4>
              <p className="text-slate-700 mb-4 text-lg">
                Quando si incontrano, occupano la stessa posizione nello spazio. Risolviamo il sistema mettendo un'equazione uguale all'altra.
              </p>
              <div className="bg-white p-6 rounded-2xl shadow-inner max-w-lg mx-auto mb-6 text-2xl font-mono">
                <div className="flex items-center justify-center gap-4 text-slate-800">
                  <span className="text-blue-700 font-bold">30t</span> 
                  <span>=</span> 
                  <span className="text-slate-700 font-bold">20t + 1000</span>
                </div>
                <div className="text-base text-slate-500 mt-2 font-sans border-t pt-2">
                  10t = 1000 &nbsp; ➡️ &nbsp; <strong className="text-red-600">t = 100 s</strong> (Preso in 100 secondi!)
                </div>
              </div>
              
              {!isAnimating && animTime === 0 && (
                <button 
                  onClick={startAnimation}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xl py-3 px-8 rounded-full shadow-lg shadow-emerald-200 transform transition-all hover:scale-105 flex items-center gap-2 mx-auto"
                >
                  <Play fill="currentColor" /> Risolvi e Cattura!
                </button>
              )}
              {animTime > 0 && !isAnimating && (
                <button 
                  onClick={resetAnimation}
                  className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 rounded-full shadow-md flex items-center gap-2 mx-auto"
                >
                  <RotateCcw /> Fai Scappare di Nuovo
                </button>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          <button 
            disabled={step === 1 || isAnimating}
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-2 text-emerald-700 font-bold disabled:opacity-30"
          >
            Indietro
          </button>
          <button 
            disabled={step === 4 || isAnimating}
            onClick={() => setStep(s => s + 1)}
            className="px-6 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold rounded-lg disabled:opacity-30 transition-colors"
          >
            Avanti
          </button>
        </div>

      </div>
    </div>
  );
}

function VarCard({ name, label, color }) {
  return (
    <div className={`p-4 rounded-xl flex flex-col items-center justify-center min-w-[100px] ${color} transition-all duration-500`}>
      <span className="text-3xl font-mono font-black">{name}</span>
      {label && <span className="text-xs font-bold mt-1 opacity-80 uppercase tracking-wide">{label}</span>}
    </div>
  );
}

// Aggiungiamo un po' di stile per le animazioni di fade-in
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out forwards;
  }
`;
document.head.appendChild(style);