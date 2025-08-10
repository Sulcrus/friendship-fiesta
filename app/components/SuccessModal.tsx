"use client";

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { CheckCircle, Download, X } from 'lucide-react';
import EventPass from './EventPass';
import html2canvas from 'html2canvas';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 40px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  text-align: center;

  @media (max-width: 768px) {
    padding: 30px 20px;
    margin: 0 10px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  color: #888;
  padding: 5px;
  border-radius: 50%;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }
`;

const SuccessIcon = styled.div`
  color: #28a745;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;

const SuccessTitle = styled.h2`
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 15px;
`;

const SuccessMessage = styled.p`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 25px;
  line-height: 1.5;
`;

const PassIdContainer = styled.div`
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  margin: 25px 0;
`;

const PassIdLabel = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const PassIdValue = styled.p`
  color: #333;
  font-size: 1.3rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
`;

const DownloadButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px auto;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

const InfoText = styled.p`
  color: #888;
  font-size: 0.9rem;
  margin-top: 20px;
  line-height: 1.4;
`;

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrationData: {
    registrationId: string;
    passId: string;
    name?: string;
    homeClub?: string;
    designation?: string;
  };
}

export default function SuccessModal({ isOpen, onClose, registrationData }: SuccessModalProps) {
  const [registrationDetails, setRegistrationDetails] = useState<{
    name: string;
    homeClub: string;
    designation: string;
    passId: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen && registrationData) {
      setRegistrationDetails({
        name: registrationData.name || 'Guest',
        homeClub: registrationData.homeClub || 'Guest Club',
        designation: registrationData.designation || 'Guest',
        passId: registrationData.passId,
      });
    }
  }, [isOpen, registrationData]);

  const downloadPass = async () => {
    const target = document.getElementById('event-pass-capture');
    if (!target) return;
    try {
      const canvas = await html2canvas(target, { backgroundColor: '#ffffff', scale: 2 });
      const link = document.createElement('a');
      link.download = `event-pass-${registrationData.passId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <X size={20} />
        </CloseButton>

        <SuccessIcon>
          <CheckCircle size={48} />
        </SuccessIcon>

        <SuccessTitle>Registration Successful!</SuccessTitle>
        
        <SuccessMessage>
          Thank you for registering for the Friendship Fiesta 3.0. Your registration has been submitted successfully.
        </SuccessMessage>

        <PassIdContainer>
          <PassIdLabel>Your Pass ID</PassIdLabel>
          <PassIdValue>{registrationData.passId}</PassIdValue>
        </PassIdContainer>

        {registrationDetails && (
          <EventPass
            name={registrationDetails.name}
            homeClub={registrationDetails.homeClub}
            designation={registrationDetails.designation}
            passId={registrationDetails.passId}
          />
        )}

        <DownloadButton onClick={downloadPass}>
          <Download size={18} />
          Download Event Pass
        </DownloadButton>

        <InfoText>
          Please save your Pass ID and download your event pass. You'll need to present this at the event entrance.
        </InfoText>
      </ModalContent>
    </ModalOverlay>
  );
}
