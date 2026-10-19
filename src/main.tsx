import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from '@/App.tsx';
import '@/index.css';
import {ComponentPreviews, useInitial} from "@/dev";
import {DevSupport} from "@react-buddy/ide-toolbox";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DevSupport ComponentPreviews={ComponentPreviews}
                    useInitialHook={useInitial}
        >
            <App/>
        </DevSupport>
    </StrictMode>
);
