"use client";

import styled from 'styled-components';
import RegistrationForm from './components/RegistrationForm';
import Header from './components/Header';

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 24px;
  background: #ffffff;
`;

const MainContent = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 720px;
  margin: 0 auto;
`;

export default function Home() {
  return (
    <PageContainer>
      <MainContent>
        <Header />
        <RegistrationForm />
      </MainContent>
    </PageContainer>
  );
}
