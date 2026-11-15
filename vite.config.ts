import {defineConfig} from 'vite';
export default defineConfig({base:'./',server:{host:'0.0.0.0'},build:{rollupOptions:{input:{main:'index.html',phase0:'phase0/index.html'}}}});
