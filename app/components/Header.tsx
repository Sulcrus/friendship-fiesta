"use client";

import Image from 'next/image';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  text-align: center;
  margin: 40px 0 24px 0;
`;

const LogoWrap = styled.div`
  width: min(220px, 60vw);
  height: 56px;
  position: relative;
  margin: 0 auto 16px auto;
`;

const Title = styled.h1`
  color: #111827; /* neutral-900 */
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 1.875rem;
  }
`;

const Subtitle = styled.p`
  color: #374151; /* neutral-700 */
  font-size: 1.05rem;
`;

export default function Header() {
  return (
    <HeaderContainer>
      <LogoWrap>
        <Image src="/logo.png" alt="Friendship Fiesta" fill priority sizes="(max-width: 768px) 60vw, 220px" style={{objectFit: 'contain'}} />
      </LogoWrap>
      <Title>Friendship Fiesta 3.0</Title>
    </HeaderContainer>
  );
}
