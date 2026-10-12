import './index.css'

import App from './App'
import { createRoot } from 'react-dom/client'
import AppearanceControls from './shared/ui/AppearanceControls'
import { applyAppearance, readAppearance } from './shared/ui/appearance'

// Apply validated visual preferences before rendering. Author: Enzo Ribas (https://github.com/oEnzoRibas).
applyAppearance(readAppearance())

createRoot(document.getElementById('root')).render(

    <><AppearanceControls /><App /></>

)
