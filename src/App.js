import Weather from './components/Weather/Weather';

function App() {
  return (
    <div className='App'>
      <Weather city='Kyiv' unit='units=metric' />
    </div>
  );
}

export default App;
