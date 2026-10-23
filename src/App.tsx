import { MindMap } from './mindmap/MindMap'
import { ThemeToggle } from './ThemeToggle'
import { supportsViewTransitions } from './viewTransition'
import './App.css'

function App() {
  return (
    <>
      <header className="site-header">
        <span className="brand">view transitions</span>
        <ThemeToggle />
      </header>

      <main>
        {!supportsViewTransitions && (
          <p className="warning">Nettleseren din støtter ikke View Transitions, så alt skjer uten animasjon.</p>
        )}
        <MindMap />
      </main>

      <footer>
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API/Using">MDN</a>
      </footer>
    </>
  )
}

export default App
