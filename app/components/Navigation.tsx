"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { Home, Settings } from 'lucide-react';

const NavContainer = styled.nav`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
`;

const NavButton = styled(Link).withConfig({
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.8)'};
  color: ${props => props.isActive ? '#667eea' : '#333'};
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.isActive ? '#667eea' : 'transparent'};
  margin-bottom: 10px;

  &:hover {
    background: rgba(255, 255, 255, 0.95);
    color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

export default function Navigation() {
  const pathname = usePathname();

  return (
    <NavContainer>
      <NavButton href="/" isActive={pathname === '/'}>
        <Home size={18} />
        Register
      </NavButton>
      <NavButton href="/admin" isActive={pathname === '/admin'}>
        <Settings size={18} />
        Admin
      </NavButton>
    </NavContainer>
  );
}
