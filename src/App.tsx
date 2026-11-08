import { Deck } from './components/deck/Deck';
import { SimHarness } from './components/deck/SimHarness';
import { ModelHarness } from './components/deck/ModelHarness';
import { Presenter } from './components/deck/Presenter';
import { LazyAmbient } from './boot/LazyAmbient';

const params = new URLSearchParams(window.location.search);
const simName = params.get('sim');
const modelName = params.get('model');
const isPresenter = params.has('apresentador');
// Prévia do próximo passo na janela do apresentador (iframe): sem o fundo animado.
const isPreview = params.has('previa');

function App() {
  return (
    <main className="w-screen h-[100dvh] relative bg-[#07050B] overflow-hidden">
      {isPresenter ? <Presenter /> : (
        <>
          {/* Fundo 3D baixa depois da capa (three.js fora da carga inicial). */}
          {!isPreview && <LazyAmbient />}
          {modelName ? <ModelHarness name={modelName} /> : simName ? <SimHarness name={simName} /> : <Deck />}
        </>
      )}
    </main>
  );
}

export default App;
