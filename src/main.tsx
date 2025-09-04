import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme, Container } from "@radix-ui/themes";

import './index.css'
import "@radix-ui/themes/styles.css";

import Layout from './Layout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme appearance="dark" accentColor="violet">
      <Container size="4">
        <Layout />
      </Container>
    </Theme>
  </StrictMode>
)
