import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import ImageEffect from './components/ImageEffect'

function App() {
  return (
    <Router>
      <div className='min-h-screen max-w-4xl bg-amber-50 mx-auto p-4 md:p-8'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/effect/:title" element={<ImageEffect />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
